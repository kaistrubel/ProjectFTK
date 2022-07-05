const JoinClass = () => {
  return (
    <>
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form action="#" method="POST">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 space-y-6 sm:p-6">
                <div className = "bubble bubble-header bubble-align-start">
                  Join a class
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="teacheremail" className="block text-sm font-medium text-white">
                      Teacher's Email
                    </label>
                    <input
                      type="text"
                      name="teacheremail"
                      id="teacheremail"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="code" className="block text-sm font-medium text-white">
                      Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      id="code"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                <div className="px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="text-black bubble bubble--highlight hover:bg-indigo-700 hover:text-white"
                >
                  Submit
                </button>
              </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
);
};

export default JoinClass;