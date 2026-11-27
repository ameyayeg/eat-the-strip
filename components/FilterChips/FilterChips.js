import { useId } from 'react'
import styles from './FilterChips.module.css'

// Filter chips at the top of a listing, in labelled groups. Each chip is a
// toggle button with its count; a chip with no matches is disabled (and
// shown with 0) unless it is selected, so chips never appear, vanish or
// reorder as filters change. The listing owns the state and the logic.
//
// groups: [{ id, label, options: [{ value, label, count, selected }], onToggle }]
// (The listing heading styles every <p>, so the note and status are <div>s.)
const FilterChips = ({ groups, activeCount, onClear, note, status }) => {
  const id = useId()
  if (!groups.length) return null

  return (
    <div className={styles.filters}>
      <div id={`${id}-panel`} className={styles.panel}>
        {groups.map((group) => (
          <div
            key={group.id}
            className={styles.group}
            role="group"
            aria-labelledby={`${id}-${group.id}`}
          >
            <span id={`${id}-${group.id}`} className={styles.groupLabel}>
              {group.label}
            </span>
            <div className={styles.chips}>
              {group.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={styles.chip}
                  aria-pressed={option.selected}
                  aria-label={`${option.label}, ${option.count} ${
                    option.count === 1 ? 'restaurant' : 'restaurants'
                  }`}
                  disabled={option.count === 0 && !option.selected}
                  onClick={() => group.onToggle(option.value)}
                >
                  {option.label}
                  <span className={styles.count} aria-hidden="true">
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.footer}>
          {note && <div className={styles.note}>{note}</div>}
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
