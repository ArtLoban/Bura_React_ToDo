import React from 'react';
import Joker from "one-liner-joke";
import './joke.css'

const Joke = () => {
    const title = 'Listen a joke';

    return (
        <div className="joke">
            <span className="joke-title">{title}: </span>
            <span className="joke-body">{Joker.getRandomJoke().body}</span>
        </div>
    );
};

export default Joke;