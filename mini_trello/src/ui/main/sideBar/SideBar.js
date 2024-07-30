import "./SideBar.scss";
import { ReactComponent as Board } from "../../../assets/images/board.svg";
import { ReactComponent as AddCirclePlusIcon } from "../../../assets/images/add-circle-plus.svg";
import { ReactComponent as FolderIcon } from "../../../assets/images/folder.svg";
import { ReactComponent as FolderOpenIcon } from "../../../assets/images/folder-open.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/images/trash.svg";
import Avatar from "../../../assets/images/avatar.svg";
import useSideBar from "./useSideBar";
import Button from "../../../component/button/Button";
import _ from "lodash";
import Modal from "../../../component/modal/Modal";
import Invitation from "./invitation/Invitation";

export default function SideBar() {
  const {
    id,
    board,
    openBoardDetail,
    isInvite,
    setIsInvite,
    isRemoveBoardMember,
    setIsRemoveBoardMember,
    setRemoveBoardMember,
    onRemoveBoardMember,
  } = useSideBar();
  return (
    <div className="side-bar ms-3 pe-3">
      {!id ? (
        <div className="board mt-4 me-3">
          <div className="d-flex align-items-center active p-2">
            <Board />
            <h5 className="m-0">Board</h5>
          </div>
        </div>
      ) : (
        <>
          <Modal
            isOpen={isInvite}
            close={() => setIsInvite(false)}
            title="Invite a person to board"
          >
            <Invitation close={() => setIsInvite(false)} />
          </Modal>
          <Modal
            isOpen={isRemoveBoardMember}
            close={() => {
              setIsRemoveBoardMember(false);
              setRemoveBoardMember(null);
            }}
            title="Remove member from board"
            footer={
              <div>
                <Button
                  className="me-2"
                  onClick={() => {
                    setIsRemoveBoardMember(false);
                    setRemoveBoardMember(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => onRemoveBoardMember()}>Remove</Button>
              </div>
            }
          >
            <div>
              Are you sure you want to remove this member from the board?
            </div>
          </Modal>
          <div className="board mt-1 me-3">
            <h5>Your boards</h5>
            <div className="board-list">
              {!_.isEmpty(board) &&
                board.map((item) => (
                  <div key={item.id} className="mb-3">
                    <Button.Image
                      image={item.active ? <FolderOpenIcon /> : <FolderIcon />}
                      children={item.name}
                      onClick={() => !item.active && openBoardDetail(item.id)}
                    />
                    {item.active && (
                      <div className="board-member">
                        <div className="d-flex justify-content-between mb-2">
                          Members
                          <Button.Image
                            image={<AddCirclePlusIcon />}
                            onClick={() => setIsInvite(true)}
                          />
                        </div>
                        {item.members.map((member) => (
                          <div
                            key={member.email}
                            className="d-flex justify-content-between align-items-center mb-1 members"
                          >
                            <div>
                              <img src={Avatar} alt="avt" />
                              <span>{member.fullname}</span>
                            </div>
                            {member.role !== "owner" && (
                              <Button.Image
                                image={<DeleteIcon />}
                                onClick={() => {
                                  setIsRemoveBoardMember(true);
                                  setRemoveBoardMember(member.email);
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
