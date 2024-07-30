import Modal from "../../../../../../component/modal/Modal";
import Avatar from "../../../../../../assets/images/rocket.png";
import { ReactComponent as FollowIcon } from "../../../../../../assets/images/eye.svg";
import { ReactComponent as PencilIcon } from "../../../../../../assets/images/pencil.svg";
import "./TaskDetail.scss";
import Button from "../../../../../../component/button/Button";
import useTaskDetail from "./useTaskDetail";
import _ from "lodash";
import FormInput from "../../../../../../component/formInput/FormInput";

export default function TaskDetail({ members, close }) {
  const { detail, setDetail, isAddMemeber, setIsAddMember, membersPopUpRef } =
    useTaskDetail({
      members,
    });
  return (
    <Modal isOpen={true} close={close} title="Task">
      <div className="d-flex task-detail">
        <div className="me-5 members">
          Members
          <div className="d-flex">
            {!_.isEmpty(detail.members) &&
              detail.members
                .slice(0, Math.min(4, detail.members.length))
                .map((member) => (
                  <img src={Avatar} alt="avt" title={member.name} />
                ))}
            {detail.members.length > 4 && (
              <div className="member-count">+{detail.members.length - 4}</div>
            )}
            <div className="position-relative">
              <Button.Text
                className="add-member"
                text="+"
                onClick={() => setIsAddMember(!isAddMemeber)}
              />
              {isAddMemeber && (
                <div className="add-member-container">
                  <div className="search">
                    <FormInput.Text
                      placeholder="Search members"
                      className="search-input"
                    />
                  </div>
                  <div ref={membersPopUpRef} className="existed-members">
                    <div className="mb-3">
                      <div className="mb-1">Members in this task</div>
                      {detail.members.map((member) => (
                        <Button.Image
                          image={<img src={Avatar} alt="" />}
                          className="member d-flex align-items-center"
                        >
                          <span>{member.name}</span>
                          <div className="remove">x</div>
                        </Button.Image>
                      ))}
                    </div>
                    <div>
                      <div className="mb-1">Other members</div>
                      {members
                        .filter((member) => {
                          const existed = detail.members.find(
                            (m) => m.id === member.id
                          );
                          return !existed;
                        })
                        .map((member) => (
                          <Button.Image
                            className="member"
                            image={<img src={Avatar} alt="" />}
                          >
                            <span>{member.name}</span>
                          </Button.Image>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          Notification
          <Button.Image className="follow" image={<FollowIcon />}>
            Watch
          </Button.Image>
        </div>
      </div>
      <div className="task-section description">
        <div className="title">
          Description
          <Button className="d-flex">
            <Button.Text text="Edit" />
            <Button.Image image={<PencilIcon />} />
          </Button>
        </div>
        <div className="content">{detail.description || "No description"}</div>
      </div>
      <div className="task-section comments">
        <div className="title">Comments</div>
        <div className="content">
          <FormInput>
            <FormInput.Text placeholder="Write a comment" />
          </FormInput>
          <div className="comment-section">
            <div className="d-flex mt-4 mb-4">
              <img src={Avatar} alt="avt" />
              <div className="comment">
                <div className="d-flex justify-content-between">
                  <div>Nhan Tran</div>
                  <div className="ms-5">12:00 07/30/2024</div>
                </div>
                <div>Comment content</div>
              </div>
            </div>
            <div className="d-flex mt-4 mb-4">
              <img src={Avatar} alt="avt" />
              <div className="comment">
                <div className="d-flex justify-content-between">
                  <div>Nhan Tran</div>
                  <div className="ms-5">12:00 07/30/2024</div>
                </div>
                <div>Comment content</div>
              </div>
            </div>
            <div className="d-flex mt-4 mb-4">
              <img src={Avatar} alt="avt" />
              <div className="comment">
                <div className="d-flex justify-content-between">
                  <div>Nhan Tran</div>
                  <div className="ms-5">12:00 07/30/2024</div>
                </div>
                <div>Comment content</div>
              </div>
            </div>
            <div className="d-flex mt-4 mb-4">
              <img src={Avatar} alt="avt" />
              <div className="comment">
                <div className="d-flex justify-content-between">
                  <div>Nhan Tran</div>
                  <div className="ms-5">12:00 07/30/2024</div>
                </div>
                <div>Comment content</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
