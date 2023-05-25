import React, { useState } from "react";
import { PageContainer } from "components/layout";
import { useSelector } from "react-redux";
import useAsyncEffect from "use-async-effect";
import { NotificationManager } from "react-notifications";
import { getUserSelector } from "../../../store/selectors";
import { firebaseRepositories } from "../../../firestore/data/repositories";
import { where } from "firebase/firestore";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { Role } from "../../../firestore/types/collections.types";
import { CardContainer } from "../../ui/CardContainer";
import { getUserFullName } from "../../../firestore/helpers";
import { convertRoleToRussian } from "../../../firestore/converters";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../../store";
import "./doctor.scss";
import { fetchUser } from "../../../store/reducers/user/actions";
import { setUser } from "../../../store/reducers/user/userSlice";
import { DoctorView } from "./DoctorView";
import Typography from "@mui/material/Typography";
import { DoctorDetails } from "./DoctorDetails";

export const DoctorPage = () => {
  const user = useSelector(getUserSelector);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [acceptedDoctor, setAcceptedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useAsyncEffect(async () => {
    try {
      setIsLoading(true);
      const newDoctors = await firebaseRepositories.users.getDocs(
        where("role", "==", Role.DOCTOR)
      );
      setDoctors(newDoctors);
    } catch (e) {
      console.log(e);
      NotificationManager.error("Загрузка докторов", 'Страница "Доктор"');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useAsyncEffect(async () => {
    if (user.doctor) {
      const newDoctor = await firebaseRepositories.users.getDocById(
        user.doctor
      );
      setSelectedDoctor(newDoctor);
    } else {
      setSelectedDoctor(null);
    }
  }, [user.doctor]);

  const denyDoctor = async () => {
    try {
      setIsRemoveLoading(true);
      await firebaseRepositories.users.updateDoc({
        ...user,
        doctor: "",
      });
      await dispatch(fetchUser(user.docId));
    } catch (e) {
      console.log(e);
      NotificationManager.error("Отказ от доктора", "Страница доктор");
      dispatch(setUser(user));
    } finally {
      setIsRemoveLoading(false);
    }
  };

  const acceptDoctor = async (uid) => {
    try {
      setIsAcceptLoading(true);
      setAcceptedDoctor(uid);
      await firebaseRepositories.users.updateDoc({
        ...user,
        doctor: uid,
      });
      await dispatch(fetchUser(user.docId));
    } catch (e) {
      console.log(e);
      NotificationManager.error("Выбор доктора", "Страница доктор");
      dispatch(setUser(user));
    } finally {
      setIsAcceptLoading(false);
      setAcceptedDoctor(null);
    }
  };

  return (
    <PageContainer className="doctor-page">
      {isLoading ? (
        <LoadingSpinner />
      ) : selectedDoctor ? (
        <div className="selected-doctor-container">
          <CardContainer className="avatar">
            <img
              className="avatar"
              style={{ objectFit: "fill" }}
              src={
                selectedDoctor.imageUrl ||
                "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
              }
              alt={getUserFullName(selectedDoctor)}
            />
          </CardContainer>
          <CardContainer className="doctor-page-info" title="Выбранный доктор">
            <div className="title">
              <h2>{getUserFullName(selectedDoctor)}</h2>
            </div>
            <div>Эл. почта: {selectedDoctor.email}</div>
            <div>Телефон: {selectedDoctor.phone}</div>
            <div>Адрес: {selectedDoctor.address}</div>
            <div>
              Тип учётной записи: {convertRoleToRussian(selectedDoctor.role)}
            </div>
            <div className="role-logo-container">
              <img
                src={`/images/logos/${selectedDoctor.role}-logo.png`}
                alt="Role logo"
              />
            </div>
            {isRemoveLoading ? (
              <LoadingSpinner style={{ margin: "10px auto", width: "250px" }} />
            ) : (
              <Button
                variant="outlined"
                sx={{
                  color: "red",
                  borderColor: "red",
                  width: "250px",
                  margin: "10px auto",
                  fontSize: "11pt",
                }}
                onClick={denyDoctor}
              >
                Отказаться от доктора
              </Button>
            )}
          </CardContainer>
          <DoctorDetails doctor={selectedDoctor} />
        </div>
      ) : (
        <div className="doctors-list">
          <Typography className="list-title" variant="h5">
            Доктора
          </Typography>
          {doctors.map((doctor) => (
            <CardContainer key={doctor.docId} className="doctor-row">
              <div className="content">
                <DoctorView doctor={doctor} />
                <DoctorDetails doctor={doctor} />
              </div>
              <div className="controls">
                <Button
                  className="select-doctor-button"
                  variant="outlined"
                  onClick={() => acceptDoctor(doctor.docId)}
                >
                  {isAcceptLoading && acceptedDoctor === doctor.docId ? (
                    <LoadingSpinner />
                  ) : (
                    "Выбрать доктора"
                  )}
                </Button>
              </div>
            </CardContainer>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
