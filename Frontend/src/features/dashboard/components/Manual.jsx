import React from "react";
//type ham upload format se pata karlenge
const Manual = () => {
  return (
    <form className="w-full flex flex-col">
      <label htmlFor="thumbnail" className="cursor-pointer">
        <div className="flex flex-col bg-background py-7 gap-2 rounded-tr-2xl rounded-tl-2xl justify-center items-center hover:border-customBlue hover:text-customBlue hover:bg-customBlue/10">
          <i className="ri-upload-line text-4xl"></i>
          <p className="text-xl">Upload file</p>
          <p className="text-secondary text-sm">
            JPEG, PNG, PDF, and MP4 formats upto, 50MB
          </p>
        </div>
      </label>
      <input type="file" id="thumbnail" hidden />
      <input
        type="text"
        placeholder="Title"
        className="p-5 bg-background  w-full outline-none border-t border-shade"
        required
      />
      <textarea
        name="hello"
        placeholder="Description"
        id=""
        className="p-5 bg-background max-h-30 w-full border-t border-shade outline-none"
      ></textarea>

      <div>
        <input
          type="text"
          placeholder="URL"
          className="p-5 bg-background w-full/2 outline-none border-t border-shade "
        />
        <input
          type="text"
          placeholder="Tags (AI, Marketing, Jobs)"
          className="p-5 bg-background w-full/2 outline-none border-t border-l border-shade "
        />
      </div>
      <button className="p-5 w-full bg-shade outline-none rounded-bl-2xl rounded-br-2xl border-t border-shade cursor-pointer hover:text-black hover:bg-foreground">
        Add to dashboard
      </button>
    </form>
  );
};

export default Manual;
