import React from "react";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    display: "flex",
    marginBottom: "20px",
    "@media (max-width: 600px)": {
      flexDirection: "column",
    },
  },
  input: {
    flex: "1",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginRight: "10px",
    "@media (max-width: 600px)": {
      marginRight: "0",
      marginBottom: "10px",
    },
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#45a049",
    },
  },
  todoList: {
    listStyle: "none",
    padding: "0",
  },
  todoItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    marginBottom: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  todoText: {
    flex: "1",
    marginRight: "10px",
  },
  priorityTag: {
    padding: "3px 6px",
    borderRadius: "3px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  topPriority: {
    backgroundColor: "#FFD700",
    color: "#333",
  },
  nonPriority: {
    backgroundColor: "#A9A9A9",
    color: "white",
  },
  actionButton: {
    padding: "5px 10px",
    fontSize: "14px",
    marginLeft: "5px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "#FFA500",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    color: "white",
  },
};

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchKeywords, setsearchKeywords] = useState("");
  const [editingId, setEditingId] = useState(null);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue }]);
      setInputValue("");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    // updatePriorities();
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setInputValue(text);
  };

  const saveEdit = () => {
    if (inputValue.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: inputValue } : todo
        )
      );
      setEditingId(null);
      setInputValue("");
    }
  };

  const onDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;
    console.log(todos);
    const newTodos = Array.from(todos);
    console.log(newTodos);
    const [reorderedItem] = newTodos.splice(result.source.index, 1);
    console.log(reorderedItem);
    newTodos.splice(result.destination.index, 0, reorderedItem);
    setTodos(newTodos);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Todo App </h1>
      <div style={styles.inputGroup}>
        <input
          style={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add or edit a todo"
        />
        {editingId ? (
          <button style={styles.button} onClick={saveEdit}>
            Save Edit
          </button>
        ) : (
          <button style={styles.button} onClick={addTodo}>
            Add Todo
          </button>
        )}
      </div>
      <div style={styles.inputGroup}>
        <input
          style={styles.input}
          value={searchKeywords}
          onChange={(e) => setsearchKeywords(e.target.value)}
          placeholder="Search todos"
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={Math.random()}>
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={styles.todoList}
            >
              {filteredTodos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...styles.todoItem,
                        ...provided.draggableProps.style,
                      }}
                    >
                      <span style={styles.todoText}>{todo.text}</span>
                      <span
                        style={{
                          ...styles.priorityTag,
                          ...(index < 5
                            ? styles.topPriority
                            : styles.nonPriority),
                        }}
                      >
                        {index < 5 ? "Top-Priority" : "Non-Priority"}
                      </span>
                      <button
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        onClick={() => startEditing(todo.id, todo.text)}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                        }}
                        onClick={() => deleteTodo(todo.id)}
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
