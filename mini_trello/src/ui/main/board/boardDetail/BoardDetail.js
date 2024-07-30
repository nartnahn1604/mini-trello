import useBoardDetail from "./useBoardDetail";
import "./BoardDetail.scss";
import { ReactComponent as AddCirclePlusIcon } from "../../../../assets/images/add-circle-plus.svg";
import Button from "../../../../component/button/Button";
import Card from "./card/Card";
import TaskDetail from "./task/TaskDetail/TaskDetail";

export default function BoardDetail() {
  const {
    boardDetail,
    cards,
    setCards,
    addCard,
    addTask,
    moveTask,
    findItem,
    moveItem,
    members,
    isAddCard,
    setIsAddCard,
    cardRef,
    isOpenTaskDetail,
    setIsOpenTaskDetail,
  } = useBoardDetail();
  return (
    boardDetail && (
      <div className="board-detail">
        {isOpenTaskDetail && (
          <TaskDetail
            members={members}
            close={() => setIsOpenTaskDetail(false)}
          />
        )}

        <div className="header">{boardDetail.name}</div>
        <div className="mt-3 ps-3 card-container">
          {cards &&
            cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                addTask={addTask}
                moveTask={moveTask}
                findItem={findItem}
                moveItem={moveItem}
                setCards={setCards}
                openTaskDetail={() => setIsOpenTaskDetail(true)}
              />
            ))}

          <Card isAddCard={isAddCard} addCard={addCard} cardRef={cardRef} />

          <Button
            key="add-card"
            className="card add-card d-flex flex-row align-items-center justify-content-between col-4 me-5"
            onClick={() => setIsAddCard(true)}
            disabled={isAddCard}
          >
            Add card
            <AddCirclePlusIcon />
          </Button>
        </div>
      </div>
    )
  );
}
