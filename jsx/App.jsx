Array.prototype.enhanceddMap = function(key, value, callback) {
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
    this.forEach(function(item, index) {
        if (item.hasOwnProperty(key) && item[key] === value) {
            if (callback) arr.push(callback(item, index))
            else arr.push(item)
        }
    })

    return arr
}

class App extends React.Component {
    constructor() {
        super()

        this.state = {
            inputValue: '',
            todos: []
        }
    }

    handleOnKeyPress = (event) => {
        if (event.key.toLowerCase() === 'enter') {
            if (this.state.inputValue) {
                const todo = {
                    id: Date.now(),
                    text: this.state.inputValue,
                    done: false
                }

                this.setState(function(prevState) {
                    return {
                        inputValue: '',
                        todos: prevState.todos.concat(todo)
                    }
                })
            }
        }
    }

    handleOnChange = (event) => {
        this.setState({
            inputValue: event.target.value
        })
    }

    handleAllDone = (event) => {
        event.preventDefault()

        this.setState(function (prevState) {
            const todos = prevState.todos.map(function(todo) {
                todo.done = true
                return todo
            })

            return {
                todos
            }
        })
    }

    handleDoneClick = (event) => {
        event.preventDefault()

        const itemId = event.target.value //event.target.parentElement.parentElement.dataset.id

        this.setState(function (prevState) {
            const todos = prevState.todos.map(function(todo) {
                if (itemId == todo.id)
                    todo.done = true

                return todo
            })

            return {
                todos
            }
        })
    }

    handleRemoveTodo = (event) => {
        event.preventDefault()

        const itemId = event.target.parentElement.dataset.id

        this.setState(function(prevState) {
            const todos = prevState.todos.filter(function(todo) {
                return itemId != todo.id
            })

            return {
                todos
            }
        })
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <Todo 
                            onHandleChange={ this.handleOnChange }
                            onHandleKeyPress={ this.handleOnKeyPress }
                            onHandleAllDone={ this.handleAllDone }
                            onHandleDoneClick={ this.handleDoneClick }
                            todos={ this.state.todos }
                            inputValue={ this.state.inputValue }
                        />
                    </div>
                    <div className="col-md-6">
                        <AlreadyDone onRemoveTodo={ this.handleRemoveTodo } todos={ this.state.todos }/>
                    </div>
                </div>
            </div>
        )
    }
}

class Todo extends React.Component {
    render () {
        return (
            <div className="todolist not-done">
                <h1>Todos</h1>
                <input 
                    value={ this.props.inputValue }
                    onChange={ this.props.onHandleChange }
                    onKeyPress={ this.props.onHandleKeyPress } 
                    type="text" className="form-control add-todo" placeholder="Add todo"/>
                <button onClick={ this.props.onHandleAllDone} id="checkAll" className="btn btn-success">Mark all as done</button>
                <hr/>
                <TodosList onHandleDoneClick={ this.props.onHandleDoneClick } todos={ this.props.todos }/>
                <TodosFooter total={ 
                    this.props.todos.enhanceddMap('done', false).length
                }/>
            </div>
        )
    }
}

class TodosList extends React.Component {
    render () {
        return (
            <ul id="sortable" className="list-unstyled">
                {
                    this.props.todos.enhanceddMap('done', false, (todo, index) => {
                        return (
                                <li  
                                    key={ index }
                                    className="ui-state-default" >
                                    <div className="checkbox">
                                        <label>
                                            <input value={ todo.id } onChange={ this.props.onHandleDoneClick } type="checkbox" />{ todo.text }
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
            <div className="todo-footer">
                <strong><span className="count-todos">{ this.props.total }</span></strong> Items Left
            </div>
        )
    }
}

class AlreadyDone extends React.Component {
    render () {
        return (
                <div className="todolist">
                    <h1>Already Done</h1>
                    <AlreadyDoneList onRemoveTodo={ this.props.onRemoveTodo } todos={ this.props.todos }/>
                </div>
        )
    }
}

class AlreadyDoneList extends React.Component {
    render () {
        return (
            <ul id="done-items" className="list-unstyled">
                {
                    this.props.todos.enhanceddMap('done', true, (todo) => {
                        return (
                            <li key={ todo.id }>{todo.text}&nbsp;
                                <button onClick={ this.props.onRemoveTodo } data-id={ todo.id } className="remove-item btn btn-default btn-xs pull-right">
                                    <span className="glyphicon glyphicon-remove"></span>
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}