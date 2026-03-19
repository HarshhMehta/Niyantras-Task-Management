const TaskCard = ({ task, user, onClick }) => {
    return (
      <div
        onClick={() => onClick(task)}
        className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`mt-1 w-4 h-4 rounded-full flex-shrink-0 border-2 ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'bg-white border-gray-300'
            }`} />
            <p className={`text-sm font-medium leading-snug ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-700'
            }`}>
              {task.title}
            </p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
            task.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {task.completed ? 'Done' : 'Pending'}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>#{task.id}</span>
          <span>{user ? user.name : `User ${task.userId}`}</span>
        </div>
      </div>
    )
  }
  
  export default TaskCard