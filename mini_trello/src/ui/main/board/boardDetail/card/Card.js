import _ from "lodash";
import Task from "../task/Task";
import "./Card.scss";
import DropWrapper from "../../../../../context/DropWrapper";
import useCard from "./useCard";
import FormInput from "../../../../../component/formInput/FormInput";
import Button from "../../../../../component/button/Button";
import { ReactComponent as SaveIcon } from "../../../../../assets/images/save.svg";
import { ReactComponent as DeleteIcon } from "../../../../../assets/images/trash.svg";
import Modal from "../../../../../component/modal/Modal";

export default function Card({
  card,
  cardRef,
  moveTask,
  findItem,
  moveItem,
  isAddCard,
  addCard,
  setCards,
  openTaskDetail,
}) {
  const {
    drop,
    cardHeaderRef,
    isEditCard,
    setIsEditCard,
    isDeleteCard,
    setIsDeleteCard,
    cardSchema,
    onUpdateCard,
    onDeleteCard,
    isAddTask,
    setIsAddTask,
  } = useCard(card, moveTask, setCards);
  return !isAddCard ? (
    !_.isEmpty(card) && (
      <>
        <Modal
          isOpen={isDeleteCard}
          close={() => setIsDeleteCard(false)}
          title="Delete Card"
          footer={
            <div>
              <Button
                className="me-2"
                onClick={() => {
                  setIsDeleteCard(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => onDeleteCard()}>Delete</Button>
            </div>
          }
        >
          <div>Are you sure you want to delete this card?</div>
        </Modal>
        <div
          className="card me-5"
          key={"card_" + card.id}
          id={"card_" + card.id}
        >
          <div
            className="card-header"
            onClick={() => {
              setTimeout(() => {
                setIsEditCard(true);
              }, 100);
            }}
            ref={cardHeaderRef}
          >
            {isEditCard ? (
              <FormInput
                id="editCardForm"
                initialValues={{ title: card.title }}
                validationSchema={cardSchema}
                onSubmit={onUpdateCard}
                className="d-flex flex-column align-items-end"
              >
                <FormInput.Text name="title" />
                <Button
                  formId="editCardForm"
                  type="submit"
                  className="ms-1 mt-1 h-50"
                >
                  <Button.Image image={<SaveIcon />} />
                </Button>
              </FormInput>
            ) : (
              <div className="d-flex justify-content-between">
                {card.title}
                <Button.Image
                  className="delete-card"
                  image={<DeleteIcon />}
                  onClick={() => {
                    setTimeout(() => {
                      setIsDeleteCard(true);
                    }, 100);
                  }}
                />
              </div>
            )}
          </div>
          <DropWrapper className="card-body tasks p-0" type="task" drop={drop}>
            <Task
              tasks={card.tasks}
              parentID={card.id}
              findItem={findItem}
              moveItem={moveItem}
              isAddTask={isAddTask}
              setIsAddTask={setIsAddTask}
              setCards={setCards}
              openTaskDetail={openTaskDetail}
            />
          </DropWrapper>
          <div
            className="card-footer add-task"
            onClick={() => setIsAddTask(true)}
          >
            Add task
          </div>
        </div>
      </>
    )
  ) : (
    <div className="card me-5" key={"add-card"} ref={cardRef}>
      <div className="card-header">
        <FormInput
          id="addCardForm"
          initialValues={{ title: "" }}
          onSubmit={(values) => addCard(values)}
          className="d-flex w-100 justify-content-between align-items-center"
        >
          <FormInput.Text name="title" placeholder="Enter card title" />
          <Button
            type="submit"
            className="ms-2 add-card-button"
            formId="addCardForm"
          >
            <Button.Text text="+" />
          </Button>
        </FormInput>
      </div>
      <div className="card-body tasks p-0"></div>
      <div className="card-footer add-task"></div>
    </div>
  );
}
