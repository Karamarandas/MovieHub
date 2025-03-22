import React, { useEffect, useState } from "react";
import useUserStore from "../store/useUserStore.js";
import useMovieStore from "../store/useMovieStore.js";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

const Profile = () => {
  const { authUser, updateUser } = useUserStore();
  const { watchlist, fetchWatchlist, isWatchlistLoading } = useMovieStore();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: authUser?.name || "",
      email: authUser?.email || "",
      password: "",
    },
  });

  useEffect(() => {
    if (authUser) {
      fetchWatchlist();
      reset({
        name: authUser.name,
        email: authUser.email,
        password: "",
      });
    }
  }, [authUser, fetchWatchlist, reset]);

  const handleSubmitForm = async (data) => {
    try {
      const updateData = {
        name: data.name,
        email: data.email,
        ...(data.password && { password: data.password }),
      };
      await updateUser(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-4xl mx-auto bg-base-100 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto rounded-full bg-base-300 flex items-center justify-center text-4xl font-bold text-base-content">
            {authUser?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold mt-4 text-base-content">
            {authUser.name}
          </h1>
          <p className="text-base-content mt-2">{authUser.email}</p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-primary px-6 py-2 rounded-lg"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-base-content">
              Edit Profile
            </h2>
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              className="space-y-4"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">Name</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="input input-bordered w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">Email</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="input input-bordered w-full"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    New Password (leave blank to keep current password)
                  </span>
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="input input-bordered w-full"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-base-content">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-base-content">Name</span>
                <span className="font-medium text-base-content">
                  {authUser.name}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-base-content">Email</span>
                <span className="font-medium text-base-content">
                  {authUser.email}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-base-content">Joined</span>
                <span className="font-medium text-base-content">
                  {new Date(authUser.created_at).toLocaleDateString()}
                </span>
              </div>
              {authUser.created_at !== authUser.updated_at && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-base-content">Updated</span>
                  <span className="font-medium text-base-content">
                    {new Date(authUser.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-base-content">
            Watchlist
          </h2>
          <div className="bg-base-300 p-4 rounded-lg">
            {isWatchlistLoading ? (
              <Loader2
                className="animate-spin text-primary mx-auto"
                size={24}
              />
            ) : (
              <p className="text-base-content">
                You have{" "}
                <span className="font-bold text-primary">
                  {watchlist.length}
                </span>{" "}
                movies in your watchlist.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
