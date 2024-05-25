import { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { IoMdText } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Alert from '@mui/material/Alert';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const InputText = styled.input`
  padding: 8px;
  margin-right: 10px;
  font-size: 16px;
  border-radius: 5px;
  width: 400px;
`;

const ModelNewText = styled.input`
  padding: 8px;
  margin-right: 10px;
  font-size: 16px;
  border-radius: 5px;
  width: 200px;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #25ca2d;
    transition: background-color 500ms;
  }
`;
const ButtonText = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: #3734db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #454cb3;
  }
`;
const ButtonClear = styled.button`
  padding: 8px 16px;
  margin-left: 5px;
  font-size: 16px;
  background-color: #cc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #df5561;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 500px;
`;

const ListBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  background-color: #ffffff;
  border: 1px solid #0e0d0d;
  border-radius: 5px;
`;

const ModalDiv = styled.div`
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

const MessageDiv = styled.div`
  height: 100px;
`

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

interface TodosProps{
  id: string;
  content: string;
}

interface ShowProps{
  show: boolean;
  type: "success" | "error";
  message: string;
}

function App() {
  const [todos, setTodos] = useState<TodosProps[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [model, setModle] =useState<boolean>(false);
  const [changeTodo, setChangeTodo] = useState<string>("")
  const [todoId, setTodoId] = useState<string>("")
  const [showAlert, setShowAlert] = useState<ShowProps>({ show: false, type: 'success', message: '' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDragEnd(result: any) {
    if (!result.destination) return;
    const quotes = [...todos];
    const [removeTodos] = quotes.splice(result.source.index, 1);
    quotes.splice(result.destination.index, 0, removeTodos);
    setTodos(quotes);
  }

  const closeAlert = ()=> {
    setTimeout(() => {
      setShowAlert({...showAlert, show: false})
    }, 2000);
  };

  const addNewTodo= ()=>{
    if(newTodo){
      const todoId = nanoid()
      const newAddedTodos = {
        id: todoId,
        content: newTodo,
      }
      setTodos([...todos, newAddedTodos]);
      setNewTodo("")
      setShowAlert({show: true, type: "success", message: "To-do başarıyla eklendi"});
      closeAlert();
    }else{
      setShowAlert({show: true, type: "error", message: "Lütfen bir değer giriniz" });
      closeAlert();
    }
  }

  const deleteTodo = (id: string)=>{
    setTodos((todos)=>{
      return todos.filter((todo)=> todo.id !== id)
    })};
    
    const modelDiv = (id: string, content: string,) =>{
        setModle(true);
        setChangeTodo(content)
        setTodoId(id)
    }

    const changeTodosNewName = () =>{
      const changeTodoName = todos.find((todo)=>todo.id ===todoId)
      if(changeTodoName){
        changeTodoName.content = changeTodo
        setTodos([...todos])
      }
      setModle(false)
    }
    const closeModel = ()=> setModle(false)

  
  return (
    <>
      <Container>
        <InputContainer>
          <InputText
            type="text"
            value={newTodo}
            onChange={(e) => {
              setNewTodo(e.target.value);
            }}
            placeholder="yeni to do ekleyiniz..."
          />
          <Button onClick={addNewTodo}>Ekle</Button>
        </InputContainer>
        <MessageDiv>
          {showAlert.show && 
            <Alert variant="filled" severity={showAlert.type} onClose={closeAlert}>
              {showAlert.message}
            </Alert>
          }
        </MessageDiv>
        <div>
          <List>
            <h2>To-Do List</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="todoList">
                {provided=>(
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {todos.map(({id, content}:TodosProps, index)=>(
                    <Draggable draggableId={id} key={id} index={index}>
                      {(provided)=>(
                        <ListBox 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        >
                          {content}
                          <div>
                          <ButtonText onClick={()=> modelDiv(id, content)}><IoMdText /></ButtonText>
                          <ButtonClear onClick={()=>deleteTodo(id)}><MdDelete /></ButtonClear>
                          </div>
                        </ListBox>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  </div>  
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </div>
      </Container>
      {
        model && 
        <ModalDiv onClick={closeModel}>
          <ModalContainer onClick={(e)=>e.stopPropagation
            ()
          }>
          <ModelNewText type="text"
          value={changeTodo} 
          onChange={(e)=>setChangeTodo(e.target.value)}/>
           <Button onClick={changeTodosNewName}>Değiştir</Button>
          </ModalContainer>
        </ModalDiv>
      }
    </>
  );
}

export default App;














