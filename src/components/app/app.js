import React, {Component} from 'react';
import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import Joke from '../joke';
import './app.css';

export default class App extends Component {
    state = {
        todoData: [
            {label: 'Drink Coffee', important: false, id: 1},
            {label: 'Make Awesome App', important: true, id: 2},
            {label: 'Have a lunch', important: false, id: 3},
            {label: 'TEst', important: true, id: 4},
        ]
    };

    /**
     * @param task_id
     */
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

        /* Выше -> мой вариант */
        return;
        /* Ниже -> автора. Более непонятный */

        this.setState(({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === task_id);

            // [a, b, c, d, e]
            // [a, b,    d, e]      // Удаление элемента из массива
            const newArray = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ];

            return {
                todoData: newArray
            }
        });
    };

    render() {
        return (
            <div className="todo-app">
                <AppHeader toDo={1} done={3}/>
                <div className="top-panel d-flex">
                    <SearchPanel/>
                    <ItemStatusFilter/>
                </div>

                <TodoList
                    todos={this.state.todoData}
                    onDeleted={this.deleteItem}
                />
                <div>
                    <Joke jokeTitle="Listen a joke"/>
                </div>
            </div>
        );
    }
}