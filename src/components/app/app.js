import React, {Component} from 'react';
import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import Joke from '../joke';
import './app.css';
import ItemAddForm from '../item-add-form';

export default class App extends Component {
    maxId = 100;
    state = {
        todoData: [
            this.createTodoItem('Learn ReactJS'),
            this.createTodoItem('Use ECMAScript 2019 new features'),
            this.createTodoItem('Have a dinner'),
        ],
        term: '',
        filter: 'all'      // active, all, done
    };

    createTodoItem(label) {
        return {
            label,
            important: false,
            done: false,
            id: this.maxId++,
        }
    }

    deleteItem = (task_id) => {
        /* ВАРИАНТ I */                                                        /* ВАРИАНТ II */
        /* C деструктуризацией объекта -> {id} */                 /* Обычный подход -> item.id */
        let todoData = this.state.todoData.filter(({id}) => {      // let todoData = this.state.todoData.filter((item) => {
            return task_id !== id;                                            //     return task_id !== item.id;
        });                                                                           // });

        this.setState(({state}) => {
            return {
                todoData: todoData
            }
        });

        /* Выше -> мой вариант. Шибаюсь работая напрямую со state? Но он ведь создает новый массив... (!) */
        return;
        /* Ниже -> автора. Более непонятный */

        this.setState(({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === task_id);

            // [a, b, c, d, e]
            // [a, b,    d, e]      // Удаление элемента из массива
            const newArray = [
                ...todoData.slice(0, idx),  // Все элементы ДО удаленного
                ...todoData.slice(idx + 1)  // Все элементы ПОСЛЕ удаленного // Сливаються в один массив
            ];

            return {
                todoData: newArray
            }
        });
    };

    addItem = (text) => {
        const newItem = this.createTodoItem(text);

        this.setState(({todoData}) => {
            const newArray = [...todoData, newItem];

            return {
                todoData: newArray
            }
        });
    };

    toggleProperty = (arr, id, propName) => {
        const idx = arr.findIndex((el) => el.id === id);

        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName]}; // [propName] -- новый синтаксис JS позволят так подставлять ключи и значения в объекте динамически

        return [
            ...arr.slice(0, idx),  // Все элементы ДО удаленного
            newItem,                        // Впихнуть обновленный объект туда где он и был до этого
            ...arr.slice(idx + 1)  // Все элементы ПОСЛЕ удаленного // Сливаються в один массив
        ];
    };

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        });
    };

    /**
     *  Stay here just like a reference of method. Before refactoring in one general method called `onToggleDone`
     * @param id
     */
    onToggleDone_BEFORE_REFACTOR = (id) => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === id);

            // 1. Update object
            const oldItem = todoData[idx];
            const newItem = {...oldItem, done: !oldItem.done}; // Это Object Spread оператор! Такая конструкци перезапишет свойство done в объекте oldItem на новое, указаное после запятой.

            // 2. Construct new array
            const newArray = [
                ...todoData.slice(0, idx),  // Все элементы ДО удаленного
                newItem,                        // Впихнуть обновленный объект туда где он и был до этого
                ...todoData.slice(idx + 1)  // Все элементы ПОСЛЕ удаленного // Сливаються в один массив
            ];

            return {
                todoData: newArray
            }
        });
    };

    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            }
        })
    };

    search = (items, term) => {
        if (term.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1;
        });
    };

    onSearchChange = (term) => {
        this.setState({term})
    };

    filter = (items, filter) => {
        switch(filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
                return items
        }
    };

    onFilterChange = (filter) => {
        this.setState({filter})
    };

    render() {
        const {todoData, term, filter} = this.state;
        const visibleItems = this.search(todoData, term);
        const filteredItems = this.filter(visibleItems, filter);
        const doneCount = todoData.filter((el) => el.done).length; // Вернет элементы у которых done = true. Filter создает новый массив!
        const todoCount = todoData.length - doneCount;

        return (
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className="top-panel d-flex">
                    <SearchPanel onSearchChange={this.onSearchChange} />
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}
                    />
                </div>
                <TodoList
                    todos={filteredItems}
                    onDeleted={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}
                />
                <ItemAddForm onItemAdded={this.addItem} />
                <Joke/>
            </div>
        );
    }
}