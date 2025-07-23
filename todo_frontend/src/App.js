import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

// PUBLIC_INTERFACE
/**
 * Todo item structure:
 * {
 *   id: number,
 *   task: string,
 *   is_complete: boolean
 * }
 */

// Table name in Supabase
const TABLE = 'todos';

// PUBLIC_INTERFACE
function App() {
  // Theme toggle state
  const [theme, setTheme] = useState('light');
  // Todo list state
  const [todos, setTodos] = useState([]);
  // Current input
  const [newTodo, setNewTodo] = useState('');
  // Editing state: id of todo being edited, value being edited
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  // Load status
  const [loading, setLoading] = useState(true);
  // Error state
  const [error, setError] = useState('');
  // Input ref for better UX
  const inputRef = useRef(null);

  // Light theme by default
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  // Fetch todos from Supabase
  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
    // Optionally: subscribe to updates via Supabase Realtime
  }, []);

  // PUBLIC_INTERFACE
  // Add a new todo
  const handleAddTodo = async e => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setError('');
    try {
      const { error } = await supabase
        .from(TABLE)
        .insert({ task: newTodo, is_complete: false });
      if (error) throw error;
      setNewTodo('');
      fetchTodos();
      inputRef.current && inputRef.current.focus();
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  // PUBLIC_INTERFACE
  // Start editing
  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.task);
  };

  // PUBLIC_INTERFACE
  // Confirm editing
  const handleConfirmEdit = async (todo) => {
    if (!editingValue.trim()) return;
    setError('');
    try {
      const { error } = await supabase
        .from(TABLE)
        .update({ task: editingValue })
        .eq('id', todo.id);
      if (error) throw error;
      setEditingId(null);
      setEditingValue('');
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  // PUBLIC_INTERFACE
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  // PUBLIC_INTERFACE
  // Delete a todo
  const handleDelete = async (id) => {
    setError('');
    try {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  // PUBLIC_INTERFACE
  // Toggle complete/incomplete
  const handleToggleComplete = async (todo) => {
    setError('');
    try {
      const { error } = await supabase
        .from(TABLE)
        .update({ is_complete: !todo.is_complete })
        .eq('id', todo.id);
      if (error) throw error;
      fetchTodos();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  // Handle "Enter" for editing
  const handleEditKeyDown = (e, todo) => {
    if (e.key === 'Enter') {
      handleConfirmEdit(todo);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="App">
      <section className="todo-container">
        <header>
          <h1 style={{ fontWeight: 700, marginBottom: 4 }}>📝 Minimal Todo List</h1>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{ position: 'absolute', top: 16, right: 16 }}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>
        <form className="todo-form" onSubmit={handleAddTodo} autoComplete="off" style={{ display: "flex", justifyContent: "center", margin: "32px 0 20px" }}>
          <input
            ref={inputRef}
            className="todo-input"
            type="text"
            value={newTodo}
            placeholder="What needs to be done?"
            onChange={e => setNewTodo(e.target.value)}
            maxLength={100}
          />
          <button type="submit" className="todo-add-btn">Add</button>
        </form>
        {error && <div className="todo-error">{error}</div>}
        <div className="todo-list-wrapper">
          {loading ? (
            <div className="todo-loading">Loading...</div>
          ) : (
            <ul className="todo-list">
              {todos.length === 0 && <li className="todo-empty">Nothing here yet!</li>}
              {todos.map(todo => (
                <li key={todo.id} className={`todo-item${todo.is_complete ? ' completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={!!todo.is_complete}
                    onChange={() => handleToggleComplete(todo)}
                    className="todo-checkbox"
                  />
                  {editingId === todo.id ? (
                    <>
                      <input
                        className="todo-edit-input"
                        value={editingValue}
                        autoFocus
                        maxLength={100}
                        onChange={e => setEditingValue(e.target.value)}
                        onKeyDown={e => handleEditKeyDown(e, todo)}
                        onBlur={handleCancelEdit}
                      />
                      <button className="todo-btn todo-save" title="Save" onMouseDown={e => e.preventDefault()} onClick={() => handleConfirmEdit(todo)}>
                        ✔️
                      </button>
                      <button className="todo-btn todo-cancel" title="Cancel" onMouseDown={e => e.preventDefault()} onClick={handleCancelEdit}>
                        ❌
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className="todo-task"
                        onDoubleClick={() => handleStartEdit(todo)}
                        title="Double click to edit"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && handleStartEdit(todo)}
                        style={{ flex: 1, cursor: 'pointer', textDecoration: todo.is_complete ? 'line-through' : 'none', opacity: todo.is_complete ? 0.5 : 1 }}
                      >
                        {todo.task}
                      </span>
                      <button className="todo-btn todo-edit" title="Edit" onClick={() => handleStartEdit(todo)}>
                        ✏️
                      </button>
                      <button className="todo-btn todo-delete" title="Delete" onClick={() => handleDelete(todo.id)}>
                        🗑️
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="todo-footer">
          <span style={{ fontSize: 13, color: "var(--text-secondary)", opacity: 0.7 }}>
            {todos.filter(t => !t.is_complete).length} items left
          </span>
        </footer>
      </section>
    </div>
  );
}

export default App;
