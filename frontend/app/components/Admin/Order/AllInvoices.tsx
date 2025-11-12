import { useGetAllCoursesQuery } from "@/redux-toolkit/features/courses/coursesApi";
import { useGetAllOrdersQuery } from "@/redux-toolkit/features/orders/orderApi";
import { useGetAllUsersQuery } from "@/redux-toolkit/features/user/userApi";
import { useTheme } from "next-themes";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { format } from "timeago.js";
import Loader from "../../Loader/Loader";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid/internals";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices: FC<Props> = ({ isDashboard }) => {
  const { theme, setTheme } = useTheme();
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: userData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(
    function () {
      if (data) {
        const temp = data.allOrders.map((item: any) => {
          const user = userData?.allUsers.find(
            (user: any) => user._id === item.userId
          );
          const course = coursesData?.allCourses.find(
            (course: any) => course._id === item.courseId
          );
          return {
            ...item,
            userName: user?.name,
            userEmail: user?.email,
            title: course?.name,
            price: "$" + course?.price,
          };
        });
        setOrderData(temp);
      }
    },
    [data, userData, coursesData]
  );

  const columns: any = [
    { field: "id", headerName: "ID", flex: 0.3 },
    {
      field: "userName",
      headerName: "Name",
      flex: isDashboard ? 0.6 : 0.5,
    },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.5 },
    ...(!isDashboard
      ? [{ field: "createdAt", headerName: "Date of Order", flex: 0.7 }]
      : [
          {
            field: "",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => {
              return (
                <a href={`mailto:${params.row.userEmail}`}>
                  <AiOutlineMail
                    className="dark:text-white text-black"
                    size={20}
                  />
                </a>
              );
            },
          },
        ]),
  ];

  const rows: any = [];

  orderData &&
    orderData.forEach((item: any) => {
      rows.push({
        id: item._id,
        userName: item.userName,
        userEmail: item.userEmail,
        title: item.title,
        price: item.price,
        createdAt: format(item.createdAt),
      });
    });

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m={isDashboard ? "0" : "40px"}>
          <Box
            m={isDashboard ? "0" : "40px 0 0 0"}
            height={isDashboard ? "35vh" : "90vh"}
            overflow={"hidden"}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
                borderRadius: "12px",
                overflow: "hidden",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "#fff",
              },
              "& .MuiDataGrid-row": {
                color:
                  theme === "dark" ? "#fff !important" : "#1a1a1a !important",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(100, 116, 139, 0.1) !important",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(59, 130, 246, 0.15) !important",
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.25) !important",
                  },
                },
              },
              "& .MuiTablePagination-root": {
                color: "#fff",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
                fontSize: "14px",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#0753cf",
                borderBottom: "none",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#2b7cfd",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#297afb",
                color: "#fff",
              },
              "& .MuiDataGrid-columnHeaderCheckbox": {
                backgroundColor: "#2f7dfa",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                color: "#fff",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor:
                  theme === "dark"
                    ? "#1e293b !important"
                    : "#f8fafc !important",
              },
              "& .MuiDataGrid-footerContainer": {
                color: "#fff",
                borderTop: "none",
                backgroundColor: "#317cf4",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
              },
              "& .MuiCheckbox-root": {
                color: "#fff !important",
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: "#3b82f6",
                color: "#fff",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#fff !important",
              },
              "& .MuiDataGrid-columnSeparator": {
                color: "rgba(255,255,255,0.3)",
              },
              "& .MuiDataGrid-panelHeader": {
                backgroundColor: "#3b82f6",
                color: "#fff",
              },
              "& .MuiMenu-paper": {
                backgroundColor:
                  theme === "dark"
                    ? "#334155 !important"
                    : "#ffffff !important",
                color:
                  theme === "dark" ? "#fff !important" : "#1a1a1a !important",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                borderRadius: "8px",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: "#fff",
              },
              "& .MuiDataGrid-menuIconButton": {
                color: "#fff",
              },
              "& .MuiDataGrid-filterIcon": {
                color: "#fff",
              },
            }}
          >
            <DataGrid
              checkboxSelection={isDashboard ? false : true}
              rows={rows}
              columns={columns}
              slots={isDashboard ? {} : { toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
