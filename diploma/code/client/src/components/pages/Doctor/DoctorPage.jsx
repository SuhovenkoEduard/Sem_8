import React, { useCallback, useEffect, useState } from "react";
import { PageContainer } from "components/layout";
import { useSelector } from "react-redux";
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
import { fetchUser } from "../../../store/reducers/user/actions";
import { setUser } from "../../../store/reducers/user/userSlice";
import { DoctorView } from "./DoctorView";
import Typography from "@mui/material/Typography";
import { DoctorDetails } from "./DoctorDetails";
import { ReviewEditModal } from "./ReviewEditModal";
import { useGeneralModalHandlers } from "../../../hooks/useGeneralModalHandlers";

import "./doctor.scss";

export const DoctorPage = () => {
  const user = useSelector(getUserSelector);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [acceptedDoctor, setAcceptedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const loadDoctors = useCallback(async () => {
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

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const updateSelectedDoctor = useCallback(() => {
    if (user.doctor) {
      const newDoctor = doctors.find((doctor) => doctor.docId === user.doctor);
      setSelectedDoctor(newDoctor);
    } else {
      setSelectedDoctor(null);
    }
  }, [user.doctor, doctors]);

  useEffect(updateSelectedDoctor, [updateSelectedDoctor]);

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

  const editReview = async (updatedReview) => {
    try {
      setIsLoading(true);
      let newReviews = selectedDoctor.employee.reviews.map((review) => {
        if (review.reviewer !== updatedReview.reviewer) {
          return review;
        }
        return updatedReview;
      });
      if (
        !newReviews.find((review) => review.reviewer === updatedReview.reviewer)
      ) {
        newReviews = [...newReviews, updatedReview];
      }
      const newDoctor = {
        ...selectedDoctor,
        employee: {
          ...selectedDoctor.employee,
          reviews: newReviews,
        },
      };
      await firebaseRepositories.users.updateDoc(newDoctor);
      await loadDoctors();
    } catch (e) {
      console.log(e);
      NotificationManager.error("Изменение отзыва", "Страница доктор");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewToDelete) => {
    try {
      setIsLoading(true);
      let newReviews = selectedDoctor.employee.reviews.filter(
        (review) => review.reviewer !== reviewToDelete.reviewer
      );
      const newDoctor = {
        ...selectedDoctor,
        employee: {
          ...selectedDoctor.employee,
          reviews: newReviews,
        },
      };
      await firebaseRepositories.users.updateDoc(newDoctor);
      await loadDoctors();
    } catch (e) {
      console.log(e);
      NotificationManager.error("Удаление отзыва", "Страница доктор");
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedReview, setSelectedReview] = useState(null);

  const [isReviewModalOpened, openReviewModal, closeReviewModal] =
    useGeneralModalHandlers({
      onOpen: (review) => {
        setSelectedReview(review);
      },
      onClose: () => {
        setSelectedReview(null);
      },
    });

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
          <DoctorDetails
            doctor={selectedDoctor}
            editReview={openReviewModal}
            deleteReview={deleteReview}
          />
          <ReviewEditModal
            isOpen={isReviewModalOpened}
            onClose={closeReviewModal}
            selectedReview={selectedReview}
            submitReview={editReview}
          />
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
