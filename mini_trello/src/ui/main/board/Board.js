import useBoard, { useBoardComponent } from "./useBoard";
import WorkSpaceIcon from "../../../assets/images/rocket.svg";
import { ReactComponent as AddCirclePlusIcon } from "../../../assets/images/add-circle-plus.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/images/trash.svg";
import "./Board.scss";
import FormInput from "../../../component/formInput/FormInput";
import Button from "../../../component/button/Button";
import Modal from "../../../component/modal/Modal";
import _ from "lodash";

const BoardComponent = ({ board, setBoards }) => {
  const { openBoardDetail } = useBoard();
  const {
    boardHeaderRef,
    isEditBoard,
    setIsEditBoard,
    isDeleteBoard,
    setIsDeleteBoard,
    onUpdateBoard,
    onDeleteBoard,
    boardSchema,
  } = useBoardComponent(board, setBoards);
  return (
    <>
      <Modal
        isOpen={isDeleteBoard}
        close={() => setIsDeleteBoard(false)}
        title="Delete board"
        footer={
          <div>
            <Button
              className="me-2"
              onClick={() => {
                setIsDeleteBoard(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => onDeleteBoard()}>Delete</Button>
          </div>
        }
      >
        <div>Are you sure you want to delete this board?</div>
      </Modal>
      <div className="col-md-4" key={board.id}>
        <div className="card mt-3">
          <div
            className="card-header d-flex align-items-start"
            ref={boardHeaderRef}
          >
            <img src={WorkSpaceIcon} alt="icon" />
            <h5
              className="card-title"
              onClick={() => {
                setTimeout(() => setIsEditBoard(true), 100);
              }}
            >
              {isEditBoard ? (
                <FormInput
                  id="editBoardForm"
                  initialValues={{ name: board.name }}
                  validationSchema={boardSchema}
                  onSubmit={onUpdateBoard}
                >
                  <FormInput.Text
                    name="name"
                    className="form-group"
                    placeholder="Enter board name"
                  />
                  <Button
                    type="submit"
                    className="create-button"
                    formId="editBoardForm"
                  >
                    <Button.Text text="Edit" />
                  </Button>
                </FormInput>
              ) : (
                board.name
              )}
            </h5>
          </div>
          <div
            className="card-body"
            onClick={() => openBoardDetail(board.id)}
          ></div>
          <div className="card-footer">
            <Button onClick={() => setIsDeleteBoard(true)}>
              <Button.Image image={<DeleteIcon />} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Board() {
  const {
    boards,
    isAdding,
    setIsAdding,
    addBoard,
    boardRef,
    setBoards,
    boardSchema,
  } = useBoard();
  return (
    <div className="board mt-4 me-4 ps-3">
      <h1>Your boards</h1>
      <div className="row">
        {!_.isEmpty(boards) &&
          boards.map((board) => (
            <BoardComponent
              key={board.id}
              board={board}
              setBoards={setBoards}
            />
          ))}
        {isAdding && (
          <div className="col-md-4">
            <div className="card mt-3">
              <div className="card-header" ref={boardRef}>
                <FormInput
                  id="newBoardForm"
                  initialValues={{ name: "" }}
                  validationSchema={boardSchema}
                  onSubmit={addBoard}
                >
                  <FormInput.Text
                    name="name"
                    className="form-group"
                    placeholder="Enter board name"
                  />
                  <Button
                    type="submit"
                    className="create-button"
                    formId="newBoardForm"
                  >
                    <Button.Text text="Create" />
                  </Button>
                </FormInput>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-4" key="create-new">
          <div
            className="card bg-transparent mt-3"
            onClick={() => setIsAdding(true)}
          >
            <div className="card-header card-body d-flex align-items-start">
              <AddCirclePlusIcon />
              <h5 className="card-title">Create new board</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
