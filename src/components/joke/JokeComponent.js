import React from 'react';
import Joker from "one-liner-joke";
import './joke.css'

const Joke = (props) => {
    return (
        <h3 className='joke'>{props.jokeTitle}: "{Joker.getRandomJoke().body}"</h3>
    );
};

export default Joke;