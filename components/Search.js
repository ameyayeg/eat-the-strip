import { useState } from "react"
import styles from '../styles/Search.module.css'


const Search = ({query, setQuery}) => {

    return ( 
        <div className={styles.searchWrapper}>
            <label className={styles.searchBar}>
            <input className={styles.searchInput} placeholder="Search..." type-="text" value={query} onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}></input>
            </label>
        </div>
     );
}
 
export default Search;