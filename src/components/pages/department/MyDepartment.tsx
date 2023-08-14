import { useEffect } from "react";
import { getAllGroup } from "../../../redux/apiRequest";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import DepartmentMain from ".";
import { useLoading } from "../../preloader/LoadingContext";

const MyDepartment = () => {
  // const [group, setGroup] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setLoading }: any = useLoading();

  //get data from Redux store
  const group = useSelector((state: any) => state.group);

  useEffect(() => {
    const fetchGroup = async () => {
      await getAllGroup(dispatch, toast, navigate);
      setLoading(false);
    };
    fetchGroup();
    // console.log(group);}
  }, []);

  return (
    <DepartmentMain>
      <Row>
        {group.allGroup.map((group: any) => {
          const { groupId, groupName, managers, postIds, usernames } = group;
          return (
            <Col key={groupId} xl="5" sm="6">
              <div className="department-card">
                <Card onClick={() => navigate("/department/" + groupId)}>
                  <Card.Header className="department-name">
                    {groupName}
                  </Card.Header>
                  <Card.Body>
                    <div className="department-info">
                      Manager:
                      {managers.map((manager: any) => (
                        <Badge key={manager} pill >
                          {manager}
                        </Badge>
                      ))}
                    </div>
                    <div className="department-info">
                      Posts:
                      <Badge key="numberOfPosts" pill >
                        {postIds.length}
                      </Badge>
                    </div>
                    <div className="department-info">
                      Members:
                      <Badge key="numberOfMembers" pill >
                        {usernames.length}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          );
        })}
      </Row>
    </DepartmentMain>
  );
};

export default MyDepartment;
