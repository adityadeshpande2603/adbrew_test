import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editHeading, setEditHeading] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const API = 'http://localhost:8000/todos/';

  useEffect(() => {
    fetchTodos();
  }, []);


  const fetchTodos = async () => {
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API, { heading, description });
      setHeading('');
      setDescription('');
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}${id}/`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

 
  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditHeading(todo.heading);
    setEditDescription(todo.description);
  };

 
  const handleUpdate = async () => {
    try {
      await axios.put(API, {
        id: editingId,
        heading: editHeading,
        description: editDescription,
      });

      setEditingId(null);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1 className="app-title">TODO Application</h1>

      {/* Create ToDo Form */}
      <div className="form-card">
        <h2>Create a ToDo</h2>
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="Heading"
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <button type="submit" className="submit-btn">
            Add ToDo
          </button>
        </form>
      </div>

      {/* TODO List */}
      <h2>Your TODOs</h2>
      <div className="todo-list">
        {todos.map((todo) => (
          <div className="todo-card" key={todo.id}>
            {editingId === todo.id ? (
              <>
                <input
                  value={editHeading}
                  onChange={(e) => setEditHeading(e.target.value)}
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <div className="btn-group">
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>{todo.heading}</h3>
                <p>{todo.description}</p>

                <div className="btn-group">
                  <button onClick={() => handleEdit(todo)}>Edit</button>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
