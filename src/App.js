import logo from './logo.svg';
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"
import './App.css';
import { useEffect, useState } from "react";
import axios from 'axios';



function App() {
  const Todos = ({ todos }) => { 
    return (
      <div className="todos">
        {
          todos.map((todo) => {
            return (
              <div className="todo" key={todo.id}>
                <button
                  onClick={() => modifyStatusTodo(todo)}
                  className="checkbox"
                  style={{ backgroundColor: todo.status ? "#A879E6" : "white" }}
               ></button>
                <p>{todo.name}</p>
                <button onClick={() => handleWithEditButtonClick(todo)}>
                  <AiOutlineEdit size={20} color={"#64697b"}></AiOutlineEdit>
                </button>
                <button onClick={() => deleteTodo(todo)}>
                  <AiOutlineDelete size = {20} color = {"#64697b"}></AiOutlineDelete>
                </button>
              </div>
            );
          })
        }
      </div>
    );
  };
  
  async function handleWithNewButton() {
    setInputVisibility(!inputVisibility);
  }

  async function handleWithEditButtonClick(todo) {
    console.log('oi', todo)
    setSelectedTodo(todo);
    setInputValue(todo.name);
    setInputVisibility(true);
  }

  async function getTodos() {
    const response = await axios.get("http://localhost:3333/todos")
    setTodos(response.data);
  }

  async function editTodo() {
    const response = await axios.put("http://localhost:3333/todos", {
      id: selectedTodo.id,
      name: inputValue
    });

    setSelectedTodo();
    setInputVisibility(false);
    getTodos();
    setInputValue('');
  }

  async function creatTodo() {
    const response = await axios.post("http://localhost:3333/todos", 
      { 
        name: inputValue, 
      }
    )
    console.log(response)
    getTodos()
    setInputVisibility(!inputVisibility);
  }

  async function deleteTodo(todo) {
    await axios.delete(`http://localhost:3333/todos/${todo.id}`);
    setInputVisibility(!inputVisibility);
    setInputValue('');
    getTodos();
    
  }

  async function modifyStatusTodo(todo){
    const response = await axios.put("http://localhost:3333/todos", {
      id: todo.id,
      status: !todo.status
      }
    )
    getTodos(); 
  }

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App">
      <header className="container">
        <div className='header'>
          <h1> Don't be lazzy </h1>
        </div>
        <Todos todos={todos} />
        <input 
          value={inputValue} 
          style={{display: inputVisibility ? 'block' : 'none'}}
          onChange={(event) => {
            setInputValue(event.target.value);
          }} 
          className='inputName'
          ></input>
        <button 
        onClick={
          inputVisibility
            ? selectedTodo
              ? editTodo
              : creatTodo
            : handleWithNewButton
        }
        className='newTaskButton'>
          {inputVisibility ? "Confirm" : "+ New task"}</button>
      </header>
     
    </div>
  );
}

export default App;
