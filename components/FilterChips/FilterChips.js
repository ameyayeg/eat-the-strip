import { useId, useRef, useState } from 'react'
import styles from './FilterChips.module.css'

// Filter chips at the top of a listing, in labelled groups. Each chip is a
// toggle button with its count; a chip with no matches is disabled (and
// shown with 0) unless it is selected, so chips never appear, vanish or
// reorder as filters change. The listing owns the state and the logic.
//
// On phones the groups sit behind a "Filters" button (with the number of
// active filters) that expands them in place; each group is then one row
// that scrolls sideways. Wider screens always show them.
//
// A group with `top` shows only its first `top` options as chips; the rest
// are in a drop-down (`moreLabel`) after them. Picking one there adds it as
// a selected chip before the drop-down; pressing that chip removes it.
//
// groups: [{ id, label, options: [{ value, label, count, selected }],
//            onToggle, top?, moreLabel? }]
// (The listing heading styles every <p>, so the status is a <div>.)
const FilterChips = ({ groups, activeCount, onClear, status }) => {
  const id = useId()
  const [open, setOpen] = useState(false)
  const selects = useRef({})
  if (!groups.length) return null

  const chip = (group, option, extra) => (
    <button
      key={option.value}
      type="button"
      className={styles.chip}
      aria-pressed={option.selected}
      aria-label={`${option.label}, ${option.count} ${
        option.count === 1 ? 'restaurant' : 'restaurants'
      }`}
      disabled={option.count === 0 && !option.selected}
      onClick={() => {
        group.onToggle(option.value)
        // The chip goes away, so move focus to the drop-down it came from.
        if (extra) {
          setTimeout(() => selects.current[group.id]?.focus(), 0)
        }
      }}
    >
      {option.label}
      <span className={styles.count} aria-hidden="true">
        {option.count}
      </span>
      {extra && (
        <span className={styles.remove} aria-hidden="true">
          ×
        </span>
      )}
    </button>
  )

  return (
    <div className={open ? `${styles.filters} ${styles.open}` : styles.filters}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(!open)}
      >
        {activeCount ? `Filters (${activeCount})` : 'Filters'}
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      <div id={`${id}-panel`} className={styles.panel}>
        {groups.map((group) => {
          const split = group.top && group.options.length > group.top
          const chips = split ? group.options.slice(0, group.top) : group.options
          const rest = split ? group.options.slice(group.top) : []
          const restSelected = rest.filter((option) => option.selected)
          const restMenu = rest
            .filter((option) => !option.selected)
            .sort((a, b) => a.label.localeCompare(b.label))
          return (
            <div
              key={group.id}
              className={styles.group}
              role="group"
              aria-labelledby={`${id}-${group.id}`}
            >
              <span id={`${id}-${group.id}`} className={styles.groupLabel}>
                {group.label}
              </span>
              <div className={styles.row}>
                <div className={styles.chips}>
                  {chips.map((option) => chip(group, option, false))}
                  {restSelected.map((option) => chip(group, option, true))}
                </div>
                {split && (
                  <select
                    ref={(el) => {
                      selects.current[group.id] = el
                    }}
                    className={styles.more}
                    aria-label={group.moreLabel}
                    value=""
                    onChange={(event) => {
                      if (event.target.value) group.onToggle(event.target.value)
                    }}
                  >
                    <option value="">{group.moreLabel}</option>
                    {restMenu.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.count === 0}
                      >
                        {`${option.label} (${option.count})`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )
        })}

        <div className={styles.footer}>
          {/* Always in the layout (hidden when unused), so nothing shifts. */}
          <button
            type="button"
            className={styles.clear}
            onClick={onClear}
            hidden={!activeCount}
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Read out how many restaurants match after each change. */}
      <div className={styles.srOnly} aria-live="polite">
        {status}
      </div>
    </div>
  )
}

export default FilterChips
