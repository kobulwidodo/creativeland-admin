import React from "react";

const Modal = ({
  handleSubmit,
  setShowModalClose,
  confirmText,
  headerText,
  children,
}) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 px-3 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto max-w-3xl w-full">
          {/*content*/}
          <form
            className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
            onSubmit={handleSubmit}
          >
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">{headerText}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={setShowModalClose}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  x
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">{children}</div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-x-5">
              {confirmText ? (
                <button
                  className="bg-green-400 text-white active:bg-green-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="submit"
                >
                  {confirmText}
                </button>
              ) : null}
              <button
                className="bg-red-400 text-white active:bg-red-400 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={setShowModalClose}
              >
                Tutup
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Modal;
