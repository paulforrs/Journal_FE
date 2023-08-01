export default function CategoriesDashboard(params) {
  const {categories, setShowAddCategoryModal} = params

  const generateCategories=()=>{
    return categories.map((category)=>{
      return <li key={category.id}>{category.name}</li>
    })
  }
  return (
    <>
      <div className="categories-dashboard dashboard-container">
        <ul className="category-list">
          {generateCategories()}
          <button onClick={()=>setShowAddCategoryModal(true)}>Add</button>
        </ul>
      </div>
    </>
  )
}
