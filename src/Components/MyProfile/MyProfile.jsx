import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../useCustomHook/useAuth";

const MyProfile = () => {
  const { user, handleUpdateProfile } = useAuth();
  const { photoURL, email, displayName, metadata } = user;
  // state for show changed at a time update, no need to reload.
  const [dp, setDp] = useState(photoURL);
  const [name, setName] = useState(displayName);

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;

    const get_image = form.photo.value;
    const defaultImageUrl =
      "https://raw.githubusercontent.com/cssmh/bookhaven-client/main/src/assets/default.jpg";
    const photo = get_image.trim() !== "" ? get_image : defaultImageUrl;

    handleUpdateProfile(name, photo)
      .then(() => {
        setDp(photo);
        setName(name);
        toast.success("update success");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row items-center gap-5 mt-6">
        <div className="w-1/2">
          <img src={dp} className="rounded-lg lg:w-60 ml-auto px-3 lg:px-0" />
        </div>
        <div className="space-y-2 mb-3 lg:mb-0 font-semibold border p-4 rounded-lg text-center md:text-left">
          <p>Hi, {displayName}</p>
          <p>{email}</p>
          <p>Account Created: {metadata?.creationTime}</p>
        </div>
      </div>
      <form onSubmit={handleUpdate} className="card-body pb-0">
        <p className="text-3xl font-semibold text-center">
          Update Profile info
        </p>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Your Name</span>
          </label>
          <input
            type="text"
            defaultValue={name}
            name="name"
            className="input input-bordered text-gray-500"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Photo URL</span>
          </label>
          <input
            type="text"
            name="photo"
            defaultValue={
              dp ===
              "https://raw.githubusercontent.com/cssmh/bookhaven-client/main/src/assets/default.jpg"
                ? ""
                : dp
            }
            className="input input-bordered text-gray-500"
          />
        </div>
        <div className="form-control mt-6">
          <input
            className="btn bg-red-500 hover:bg-red-500 text-white"
            type="submit"
            value="Update Info"
          />
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
