import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { Button, Col, Form, Image, InputGroup, Row } from "react-bootstrap";
import LeftSider from "../../components/layout/menu/left";
import { toast } from "react-toastify";
import { Camera, Check2, X } from "react-bootstrap-icons";

import imageCompression from "browser-image-compression";
import { CurrentUserContext } from "../../components/context/currentUser";
import { apiResquest, postAPI } from "../../api";

const Profile = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [input, setInput] = useState<any>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>({ file: null });
  const [showAvtBtn, setShowAvtBtn] = useState<any>(false);

  const { currentUser, setUser }: any = useContext(CurrentUserContext);

  // const phoneNumberInput = useRef<any>(null);
  // useEffect(() => {
  //   if (phoneNumberInput.current && editable === true) {
  //     phoneNumberInput.current.focus();
  //   }
  // }, [phoneNumberInput]);

  const handleChange = (e: any) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }; //set input fields

  //change password
  const handleChangePassword = async () => {
    const body = {
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
    };
    if (await postAPI({ path: "/personal/resetPassword", body: body })) {
      toast.success("Password has been changed successfully");
      setExpanded(false);
      setInput("");
      setShowPassword(false);
      console.log(body);
    }
  };

  //send email to change password
  const handleSendEmail = async () => {
    const body = { username: currentUser.username, email: currentUser.email };
    try {
      await apiResquest({
        method: "patch",
        url: "/personal/resetPassword",
        data: body,
        successMessage: "An email has been sent. Please check your email",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //change phone number
  const handleChangePhoneNumber = async () => {
    const body = { phoneNumber: input.newPhoneNumber };
    try {
      await postAPI({ path: "/personal", body: body });
      setEditable(false);
      setUser(
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ ...currentUser, phoneNumber: input.newPhoneNumber })
        )
      );
    } catch (error) {
      setEditable(false);
    }
  };

  //set Escapse key
  const handleKeyDown = (e: any) => {
    if (e.key === "Escape") {
      setEditable(false);
    }
  };

  //change img to base64
  const getBase64 = (file: any) => {
    return new Promise((resolve) => {
      let baseURL = "";
      const reader: any = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  //change avatar
  const handleChangeAvatar = async (e: any) => {
    setShowAvtBtn(true);
    let { file } = avatar;
    file = e.target.files[0];
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 200,
      useWebWorker: true,
    }; // compress img settings
    const compressedFile = await imageCompression(file, options);
    getBase64(compressedFile).then((result) => {
      file["base64"] = result;
      setAvatar(file);
    });
  };

  //submit avatar to server
  const handleSubmitAvatar = async () => {
    console.log(avatar);
    const body = {
      phoneNumber: currentUser.phoneNumber,
      base64Avatar: avatar?.base64.split(",")[1] || undefined,
    };
    if (await postAPI({ path: "/personal", body: body })) {
      toast.success("Avatar saved successfully");
      window.location.reload();
      setShowAvtBtn(false);
    }
  };

  return (
    <>
      <Col xs={3}>
        <LeftSider />
      </Col>
      <Col xs={9} className="main-content">
        <Row className="profile-setting">
          <Col className="top-area" sm="4">
            <div className="avatar-area">
              <Image
                src={
                  showAvtBtn ? `${avatar.base64}` : `${currentUser.avatarUrl}`
                }
              />

              <Form.Label htmlFor="avatar">
                <Camera className="change-avatar-icon" />
              </Form.Label>
              <Form.Control
                className="d-none"
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleChangeAvatar}
              />
            </div>
            {showAvtBtn ? (
              <Button
                variant="outline-primary"
                className="mt-2"
                onClick={handleSubmitAvatar}
              >
                Save avatar
              </Button>
            ) : null}
            <h3>{`${currentUser.lastname} ${currentUser.firstname}`}</h3>
          </Col>
          <Col className="info-area" sm="8">
            <Row>
              <InputGroup as={Row}>
                <Col sm="3">
                  <label htmlFor="">Username</label>
                </Col>
                <Col sm="8">
                  <Form.Control readOnly defaultValue={currentUser.username} />
                </Col>
              </InputGroup>
            </Row>
            <Row>
              <InputGroup as={Row}>
                <Col sm="3">
                  <label htmlFor="">Password</label>
                </Col>
                <Col sm="6">
                  <Form.Control
                    type="password"
                    readOnly
                    defaultValue={"password"}
                  />
                </Col>
                <Col sm="3">
                  <span
                    className="txtsm"
                    onClick={() => {
                      setExpanded(!expanded);
                      setInput({});
                    }}
                  >
                    {expanded ? "Close" : "Change password"}
                  </span>
                </Col>
              </InputGroup>
              <Form action="reply-comment">
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      className="change-password d-flex gap-3 ms-4"
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: {
                          opacity: 1,
                          height: "auto",
                        },
                        collapsed: { opacity: 0, height: 0, marginTop: 0 },
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      }}
                    >
                      <Row>
                        <InputGroup as={Row}>
                          <Col sm="4">
                            <label htmlFor="currentPassword">Password</label>
                          </Col>
                          <Col sm="8">
                            <Form.Control
                              name="currentPassword"
                              value={input.currentPassword}
                              onChange={handleChange}
                              type={showPassword ? "text" : "password"}
                            />
                          </Col>
                        </InputGroup>
                        <InputGroup as={Row}>
                          <Col sm="4">
                            <label htmlFor="newPassword">New password</label>
                          </Col>
                          <Col sm="8">
                            <Form.Control
                              name="newPassword"
                              value={input.newPassword}
                              onChange={handleChange}
                              type={showPassword ? "text" : "password"}
                            />
                          </Col>
                        </InputGroup>

                        <Col className="action">
                          <span
                            className="txtsm"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide Password" : "Show Password"}
                          </span>
                          <span className="txtsm" onClick={handleSendEmail}>
                            Forgot password? Reset via Email
                          </span>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={handleChangePassword}
                          >
                            Confirm
                          </Button>
                        </Col>
                      </Row>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Form>
            </Row>
            <Row>
              <InputGroup as={Row}>
                <Col sm="3">
                  <label htmlFor="">Email</label>
                </Col>
                <Col sm="8">
                  <Form.Control readOnly defaultValue={currentUser.email} />
                </Col>
              </InputGroup>
            </Row>
            <Row>
              <InputGroup as={Row}>
                <Col sm="3">
                  <label htmlFor="phoneNumber">Phone number</label>
                </Col>
                <Col sm="6">
                  <Form.Control
                    name="newPhoneNumber"
                    value={
                      editable ? input.newPhoneNumber : currentUser.phoneNumber
                    }
                    onChange={handleChange}
                    readOnly={editable ? false : true}
                    defaultValue={currentUser.phoneNumber}
                    style={
                      editable
                        ? { backgroundColor: "var(--hover-color)" }
                        : { backgroundColor: "" }
                    }
                    onKeyDown={handleKeyDown}
                    // ref={phoneNumberInput}
                  />
                </Col>

                <Col sm="3">
                  {editable ? (
                    <>
                      <Button className="btn-transparent">
                        <Check2
                          className="inline-icon"
                          onClick={handleChangePhoneNumber}
                        />
                      </Button>
                      <Button className="btn-transparent">
                        <X
                          className="inline-icon"
                          onClick={() => setEditable(false)}
                        />
                      </Button>
                    </>
                  ) : (
                    <span
                      onClick={() => {
                        setEditable(!editable);
                      }}
                      className="btn-transparent txtsm"
                    >
                      Edit phone numbers
                    </span>
                  )}
                </Col>
              </InputGroup>
            </Row>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Profile;
