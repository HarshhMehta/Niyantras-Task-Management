const Navbar = ({ title }) => {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="h-1 w-12 bg-blue-600 rounded mt-1"></div>
      </div>
    )
  }
  
  export default Navbar