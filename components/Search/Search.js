import styles from './Search.module.css'

const Search = ({ query, setQuery }) => {
  return (
    <div className={styles.searchWrapper}>
      <label className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Search food, cuisine, or address..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
        />
      </label>
    </div>
  )
}

export default Search
