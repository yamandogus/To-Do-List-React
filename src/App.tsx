import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";

interface Item {
  id: string;
  content: string;
}

const getItems = (count: number, offset = 0): Item[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + offset}-${new Date().getTime()}`,
    content: `item ${index + offset}`
  }));

const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (
  source: Item[],
  destination: Item[],
  droppableSource: DropResult,
  droppableDestination: DropResult
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone
  };
};

const grid = 8;

const ItemContainer = styled.div`
  user-select: none;
  padding: ${grid * 2}px;
  margin-bottom: ${grid}px;
  background: lightblue; /* Arka plan rengi */
`;

const Button = styled.button`
  margin-right: 10px;
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const App: React.FC = () => {
  const [groups, setGroups] = useState<Item[][]>([getItems(10)]);

  const [newItemContent, setNewItemContent] = useState<string>("");

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(groups[sInd], source.index, destination.index);
      const newGroups = [...groups];
      newGroups[sInd] = items;
      setGroups(newGroups);
    } else {
      const result = move(groups[sInd], groups[dInd], source, destination);
      const newGroups = [...groups];
      newGroups[sInd] = result[sInd];
      newGroups[dInd] = result[dInd];
      setGroups(newGroups.filter(group => group.length));
    }
  };

  const handleNewItemAddition = () => {
    if (newItemContent.trim() !== "") {
      const lastGroupIndex = groups.length - 1;
      const lastGroup = groups[lastGroupIndex];
      if (lastGroup.length < 10) {
        const newGroups = [...groups];
        newGroups[lastGroupIndex] = [...lastGroup, { id: `item-${Date.now()}`, content: newItemContent }];
        setGroups(newGroups);
      } else {
        setGroups([...groups, [{ id: `item-${Date.now()}`, content: newItemContent }]]);
      }
      setNewItemContent("");
    }
  };

  const handleNewGroupAddition = () => {
    setGroups([...groups, []]);
  };

  return (
    <div>
      <Input
        type="text"
        value={newItemContent}
        onChange={(e) => setNewItemContent(e.target.value)}
        placeholder="Add new item"
      />
      <Button onClick={handleNewItemAddition}>Add</Button>
      <Button onClick={handleNewGroupAddition}>Add new group</Button>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {groups.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? "lightblue" : "lightgrey", // Liste arka plan rengi
                    padding: grid,
                    width: 250
                  }}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ItemContainer
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around"
                            }}
                          >
                            {item.content}
                            <button
                              type="button"
                              onClick={() => {
                                const newGroups = [...groups];
                                newGroups[ind].splice(index, 1);
                                setGroups(
                                  newGroups.filter(group => group.length)
                                );
                              }}
                            >
                              delete
                            </button>
                          </div>
                        </ItemContainer>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;













