import { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { IoMdText } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Alert from '@mui/material/Alert';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 20px;
  border-radius: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const TodoInput = styled.input`
  padding: 10px;
  margin-right: 10px;
  font-size: 16px;
  border: 2px solid #ced4da;
  border-radius: 5px;
  width: 400px;
`;

const EditInput = styled.input`
  padding: 10px;
  margin-right: 10px;
  font-size: 16px;
  border: 2px solid #ced4da;
  border-radius: 5px;
  width: 200px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 7px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
    transition: background-color 300ms;
  }
`;

const EditButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 7px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
    transition: background-color 300ms;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  margin-left: 5px;
  font-size: 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 7px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
    transition: background-color 300ms;
  }
`;

const TodoListContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 500px;
`;

const TodoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 10px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const MessageContainer = styled.div`
  height: 100px;
`;

interface TodosProps {
  id: string;
  content: string;
}

interface ShowProps {
  show: boolean;
  type: "success" | "error";
  message: string;
}

function App() {
  const [todos, setTodos] = useState<TodosProps[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [changeTodo, setChangeTodo] = useState<string>("");
  const [todoId, setTodoId] = useState<string>("");
  const [showAlert, setShowAlert] = useState<ShowProps>({ show: false, type: 'success', message: '' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDragEnd(result: any) {
    if (!result.destination) return;
    const quotes = [...todos];
    const [removeTodos] = quotes.splice(result.source.index, 1);
    quotes.splice(result.destination.index, 0, removeTodos);
    setTodos(quotes);
  }

  const closeAlert = () => {
    setTimeout(() => {
      setShowAlert({ ...showAlert, show: false });
    }, 2000);
  };

  const addNewTodo = () => {
    if (newTodo) {
      const todoId = nanoid();
      const newAddedTodo = {
        id: todoId,
        content: newTodo,
      };
      setTodos([...todos, newAddedTodo]);
      setNewTodo("");
      setShowAlert({ show: true, type: "success", message: "To-do başarıyla eklendi" });
      closeAlert();
    } else {
      setShowAlert({ show: true, type: "error", message: "Lütfen bir değer giriniz" });
      closeAlert();
    }
  };

  const deleteTodo = (id: string) => {
    setTodos((todos) => {
      return todos.filter((todo) => todo.id !== id);
    });
  };

  const openModal = (id: string, content: string) => {
    setModal(true);
    setChangeTodo(content);
    setTodoId(id);
  };

  const changeTodoName = () => {
    const updatedTodo = todos.find((todo) => todo.id === todoId);
    if (updatedTodo) {
      updatedTodo.content = changeTodo;
      setTodos([...todos]);
    }
    setModal(false);
  };

  const closeModal = () => setModal(false);

  return (
    <>
      <Wrapper>
        <InputContainer>
          <TodoInput
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Yeni to-do ekleyiniz..."
          />
          <AddButton onClick={addNewTodo}>Ekle</AddButton>
        </InputContainer>
        <MessageContainer>
          {showAlert.show &&
            <Alert variant="filled" severity={showAlert.type} onClose={closeAlert}>
              {showAlert.message}
            </Alert>
          }
        </MessageContainer>
        <div>
          <TodoListContainer>
            <h2>To-Do Listesi</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="todoList">
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {todos.map(({ id, content }: TodosProps, index) => (
                      <Draggable draggableId={id} key={id} index={index}>
                        {provided => (
                          <TodoItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {content}
                            <div>
                              <EditButton onClick={() => openModal(id, content)}><IoMdText /></EditButton>
                              <DeleteButton onClick={() => deleteTodo(id)}><MdDelete /></DeleteButton>
                            </div>
                          </TodoItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TodoListContainer>
        </div>
      </Wrapper>
      {
        modal &&
        <Overlay onClick={closeModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <EditInput
              type="text"
              value={changeTodo}
              onChange={(e) => setChangeTodo(e.target.value)}
            />
            <EditButton onClick={changeTodoName}>Değiştir</EditButton>
          </ModalContainer>
        </Overlay>
      }
    </>
  );
}

export default App;














