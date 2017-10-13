Array.prototype.enhanceddMap = function (key, value, callback) {
    if (this == null) {
        throw new TypeError('this is null or not defined');
    }

    if (!Array.isArray(this))
        throw new TypeError('this is not an array');

    if (typeof key === 'undefined')
        throw new TypeError('key parameter is not defined');

    if (typeof value == 'undefined')
        throw new TypeError('value parameter is not defined');

    if (callback && typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }

    if (!this.length)
        return []

    const arr = []
    this.forEach(function (item, index) {
        if (item.hasOwnProperty(key) && item[key] === value) {
            arr.push(callback ? callback(item, index) : item)
        }
    })

    return arr
}

class App extends React.Component {
    constructor() {
        super()

        this.state = {
            todos: []
        }
    }

    InsertNewTodo = (text) => {
        const todo = {
            id: Date.now(),
            text,
            done: false
        }

        this.setState(function (prevState) {
            return {
                todos: prevState.todos.concat(todo)
            }
        })
    }

    MarkAllDone = () => {
        if (this.state.todos && this.state.todos.length > 0) {
            this.setState(function (prevState) {
                const todos = prevState.todos.map(function (todo) {
                    todo.done = true
                    return todo
                })
    
                return {
                    todos
                }
            })    
        }
    }

    MarkDoneThisTodo = (item) => {
        this.setState(function (prevState) {
            const todos = prevState.todos.map(function (todo) {
                if (item == todo.id)
                    todo.done = true

                return todo
            })

            return {
                todos
            }
        })
    }

    RemoveThisTodo = (item) => {
        this.setState(function (prevState) {
            const todos = prevState.todos.filter(function (todo) {
                return item != todo.id
            })

            return {
                todos
            }
        })
    }

    render() {
        return (
            <div className = "container">
                <div className = "row">
                    <div className = "col-md-6">
                        <Todo
                            onInsertNewTodo = { this.InsertNewTodo }
                            onMarkAllDone = { this.MarkAllDone }
                            onMarkDoneThisTodo = { this.MarkDoneThisTodo }
                            todos = { this.state.todos }
                        />
                    </div>
                    <div className = "col-md-6">
                        <AlreadyDone
                            onRemoveThisTodo = { this.RemoveThisTodo }
                            todos = { this.state.todos }
                        />
                    </div>
                </div>
            </div>
        )
    }
}

class Todo extends React.Component {

    constructor() {
        super()

        this.state = {
            text: '',
        }
    }

    handleOnChange = (event) => {
        event.preventDefault()

        this.setState({
            text: event.target.value
        })
    }

    handleOnKeyPress = (event) => {
        if (event.key.toLowerCase() === 'enter') {
            const text = this.state.text
            if (text) {
                this.props.onInsertNewTodo(text)
                this.setState({
                    text: ''
                })
            }
            event.target.value = ''
        }
    }

    handleMarkAllDone = (event) => {
        event.preventDefault()

        this.props.onMarkAllDone()
    }

    render() {
        return (
            <div className = "todolist not-done" >
                <h1>Todos</h1>
                <input
                    onChange = { this.handleOnChange }
                    onKeyPress = { this.handleOnKeyPress }
                    type = "text"
                    className = "form-control add-todo"
                    placeholder = "Add todo"
                />
                <button 
                    onClick = { this.handleMarkAllDone }
                    id = "checkAll"
                    className = "btn btn-success">Mark all as done
                </button>
                <hr/>
                <TodosList
                    onMarkDoneThisTodo = { this.props.onMarkDoneThisTodo }
                    todos = { this.props.todos }
                />
                <TodosFooter
                    total = {
                        this.props.todos.reduce(function (acum, todo) {
                            return !todo.done ? ++acum : acum
                        }, 0)
                    }
                />
            </div>
        )
    }
}

class TodosList extends React.Component {
    handleDoneClick = (event) => {
        const itemId = event.target.value //event.target.parentElement.parentElement.dataset.id
        setTimeout(() => this.props.onMarkDoneThisTodo(itemId), 150)
    }

    render() {
        return (
            <ul id = "sortable" className = "list-unstyled" > {
                this.props.todos.enhanceddMap('done', false, (todo) => {
                    return (
                        <li key = { todo.id } className = "ui-state-default">
                            <div className = "checkbox">
                                <label>
                                    <input value = { todo.id }
                                        onChange = { this.handleDoneClick }
                                        type = "checkbox"
                                    />{ todo.text }
                                </label>
                            </div>
                        </li>
                    )
                })
            }
            </ul>
        )
    }
}

class TodosFooter extends React.Component {
    render() {
        return (
            <div className = "todo-footer">
                <strong>
                    <span className = "count-todos">{ this.props.total}</span>
                </strong>Items Left
            </div>
        )
    }
}

class AlreadyDone extends React.Component {
    render() {
        return ( 
            <div className = "todolist">
                <h1>Already Done</h1>
                <AlreadyDoneList 
                    onRemoveThisTodo = { this.props.onRemoveThisTodo } 
                    todos = { this.props.todos }
                />
            </div>
        )
    }
}

class AlreadyDoneList extends React.Component {

    handleRemoveThisTodo = (event) => {
        event.preventDefault()
        
        const itemId = event.target.parentElement.dataset.id
        this.props.onRemoveThisTodo(itemId)
    }

    render() {
        return (
            <ul id = "done-items" className = "list-unstyled" >
            {
                this.props.todos.enhanceddMap('done', true, (todo) => {
                    return (
                        <li key = { todo.id}>
                            { todo.text }&nbsp;
                            <button
                                onClick = { this.handleRemoveThisTodo }
                                data-id = { todo.id }
                                className = "remove-item btn btn-default btn-xs pull-right">
                                    <span className = "glyphicon glyphicon-remove"></span>
                            </button>
                        </li>
                    )
                })
            }
            </ul>
        )
    }
}