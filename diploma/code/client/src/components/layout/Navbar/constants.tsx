import React from "react";
import { Role } from "firestore/types/collections.types";
import { Routes } from "components/routing/constants";
import PersonIcon from "@mui/icons-material/Person";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AlarmIcon from "@mui/icons-material/Alarm";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChatIcon from "@mui/icons-material/Chat";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import InsightsIcon from "@mui/icons-material/Insights";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

export type NavBarItem = {
  id: number;
  icon: React.ReactNode;
  label: string;
  route: Routes;
  roles: Role[];
};

export const topNavbarItems: NavBarItem[] = [
  {
    id: 0,
    icon: <PersonIcon />,
    label: "Профиль",
    route: Routes.profile,
    roles: [...Object.values(Role)],
  },
];

export const navbarItemsData: Omit<NavBarItem, "id">[] = [
  {
    icon: <SummarizeIcon />,
    label: "Дневник",
    route: Routes.diary,
    roles: [Role.PATIENT],
  },
  {
    icon: <AlarmIcon />,
    label: "Цели",
    route: Routes.goals,
    roles: [Role.PATIENT],
  },
  {
    icon: <TrendingUpIcon />,
    label: "Статистика",
    route: Routes.statistics,
    roles: [Role.PATIENT],
  },
  {
    icon: <ChatIcon />,
    label: "Диалоги",
    route: Routes.dialogs,
    roles: [Role.PATIENT, Role.DOCTOR],
  },
  {
    icon: <FamilyRestroomIcon />,
    label: "Родственник",
    route: Routes.patientRelative,
    roles: [Role.PATIENT],
  },
  {
    icon: <InsightsIcon />,
    label: "Статистика родственника-пациента",
    route: Routes.statistics,
    roles: [Role.RELATIVE],
  },
  {
    icon: <QueryStatsIcon />,
    label: "Статистика пациентов",
    route: Routes.patientsStatistics,
    roles: [Role.DOCTOR],
  },
  {
    icon: <WysiwygIcon />,
    label: "Тематические материалы",
    route: Routes.thematicMaterials,
    roles: [
      Role.PATIENT,
      Role.RELATIVE,
      Role.DOCTOR,
      Role.CONTENT_MAKER,
      Role.MODERATOR,
    ],
  },
  {
    icon: <PeopleIcon />,
    label: "Работники",
    route: Routes.employees,
    roles: [Role.ADMIN],
  },
];

export const bottomNavBarItems: NavBarItem[] = [
  {
    id: 0,
    icon: <LogoutIcon />,
    label: "Выход",
    route: Routes.signOut,
    roles: [...Object.values(Role)],
  },
];

export const navBarItems: NavBarItem[] = navbarItemsData.map((data, index) => ({
  ...data,
  id: index,
}));
