import { Box, Button, Modal } from "@mui/material";
import { useTheme } from "next-themes";
import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "../../../../redux-toolkit/features/user/userApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

type Props = {
  isTeam?: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState(false);
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [open, setOpen] = useState(false);

  const [
    deleteUser,
    { isLoading: isDeleting, isSuccess: deleteSuccess, error: deleteError },
  ] = useDeleteUserMutation({});
  const [
    updateUserRole,
    { isLoading: isUpdating, isSuccess: updateSuccess, error: updateError },
  ] = useUpdateUserRoleMutation({});
  const { isLoading, data, error, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(
    function () {
      if (updateSuccess) {
        refetch();
        toast.success("User role updated!");
      }
      if (deleteSuccess) {
        refetch();
        toast.success("User deleted!");
      }
      if (updateError) {
        if ("data" in updateError) {
          const msg =
            (updateError.data as any)?.message || "Failed to update user role";
          toast.error(msg);
        } else {
          toast.error(
            (updateError as any)?.message || "Failed to update user role"
          );
        }
      }
      if (deleteError) {
        if ("data" in deleteError) {
          const msg =
            (deleteError.data as any)?.message || "Failed to delete user";
          toast.error(msg);
        } else {
          toast.error((deleteError as any)?.message || "Failed to delete user");
        }
      }
    },
    [deleteSuccess, updateSuccess, updateError, deleteError]
  );
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "User name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Courses Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Button>
            <AiOutlineDelete
              className="dark:text-white text-black"
              size={20}
              onClick={() => {
                setOpen(open => !open);
                setUserId(params.row.id);
              }}
            />
          </Button>
        );
      },
    },
    {
      field: "  ",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <a href={`mailto:${params.row.email}`}>
              <AiOutlineMail
                className="dark:text-white mt-4 text-black"
                size={20}
              />
            </a>
          </>
        );
      },
    },
  ];

  let rows: any = [];

  if (isTeam) {
    const newData =
      data && data.allUsers.filter((item: any) => item.role === "admin");

    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  } else {
    data &&
      data.allUsers.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  }
  async function handleSubmit() {
    await updateUserRole({ email, role });
    if (updateSuccess) setActive(false);
  }
  function handleDelete() {
    if (!isLoading) {
      deleteUser(userId);
    }
  }

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className={`w-full flex justify-end`}>
            <div
              className={`${styles.button} !w-[240px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
              onClick={() => setActive(!active)}
            >
              Add new member
            </div>
          </div>
          <Box
            m="40px 0 0 0"
            height="80vh"
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
                backgroundColor: "#166efc",
                borderBottom: "none",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#2879fd",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#2879f9",
                color: "#fff",
              },
              "& .MuiDataGrid-columnHeaderCheckbox": {
                backgroundColor: "#2477fd",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                color: "#fff",
              },
              // Body background adapts to theme
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor:
                  theme === "dark"
                    ? "#1e293b !important"
                    : "#f8fafc !important",
              },
              // Footer matches header
              "& .MuiDataGrid-footerContainer": {
                color: "#fff",
                borderTop: "none",
                backgroundColor: "#1e71f7",
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
              // Menu and panel styling
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
              // disableRowSelectionOnClick
              checkboxSelection
              rows={rows}
              columns={columns}
            />
          </Box>
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className={`${styles.input}`}
                  />
                  <select
                    name=""
                    id=""
                    className={`${styles.input} !mt-6`}
                    onChange={(e: any) => setRole(e.target.value)}
                  >
                    <option
                      className="dark:text-black text-black"
                      value="admin"
                    >
                      Admin
                    </option>
                    <option className="dark:text-black text-black" value="user">
                      User
                    </option>
                  </select>
                  <br />
                  <div
                    className={`${styles.button} my-6 !h-[30px]`}
                    onClick={handleSubmit}
                  >
                    {isUpdating ? "Updating..." : "Submit"}
                  </div>
                </div>
              </Box>
            </Modal>
          )}
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
                    onClick={() => {
                      setOpen(!open);
                      setUserId("");
                    }}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                    onClick={() => {
                      setOpen(false);
                      handleDelete();
                    }}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllUsers;
