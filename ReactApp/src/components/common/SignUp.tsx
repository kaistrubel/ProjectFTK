const v1 = () => {
    return (
      <div className="grid place-items-center pt-16">
        <div className="bubble bubble-header">
          Welcome to <strong>Project FTK.</strong>
        </div>
        <div className="container flex items-start justify-between flex-col lg:flex-row signup" id="signup">
          <div className="flex-1 w-full lg:w-1/2 bg-[url('assets/images/teacher_signin.png')] comic-border bg-auto">
            <div className="grid grid-rows-[100px_minmax(200px,_1fr)_100px] place-items-center">
              <div className="relative title">Teachers</div>
              <div className="relative -bottom-40">
                <a
                  className="bubble bubble--highlight"
                  href="https://projectftk.com/Auth/GoogleLogin?isTeacher=true"
                >Sign in with Google</a>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full lg:w-1/2 bg-[url('assets/images/student_signin.png')] comic-border bg-auto">
            <div className="grid grid-rows-[100px_minmax(200px,_1fr)_100px] place-items-center">
              <div className="relative title">Students</div>
              <div className="relative -bottom-40">
                  <a
                    className="bubble bubble--highlight"
                    href="https://projectftk.com/Auth/GoogleLogin"
                  >Sign in with Google</a>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div className="w-full landing-info bg-[url('https://www.imageworks.com/sites/default/files/inline-images/spi_intospiderverse_website_content_024.jpg')] comic-border bg-right bg-contain">
          <div className="pl-10 pt-3">
              <h2 className="bubble bubble-align-start text-sm w-fit">Lorem Ipsum is simply dummy text of the printing and.</h2>
          </div>
          <div className="pl-10">
              <h2 className="bubble bubble-align-start text-sm w-fit">Lorem Ipsum is simply dummy text of the printing and.</h2>
          </div>
        </div>
      </div>
  );
};

const SignUp = () => {
  return (
    <>
    <div className="grid place-items-center w-screen h-screen bg-[url('https://www.imageworks.com/sites/default/files/inline-images/spi_intospiderverse_website_content_012.jpg')] bg-right bg-fit">
      <div className="bubble bubble-header bubble-no-margin">
        Welcome to <strong>Project FTK.</strong>
      </div>
      <div className="pl-10 pt-3">
            <h2 className="bubble text-sm w-fit bubble-no-margin">Lorem Ipsum is simply dummy text of the printing and.</h2>
      </div>
      <div className="pl-10">
            <h2 className="bubble text-sm w-fit bubble-no-margin">Lorem Ipsum is simply dummy text of the printing and.</h2>
      </div>
    </div>
    <div className="grid place-items-center w-screen h-96 bg-black comic-border bg-right bg-contain">
      <h2 className="bubble bubble-header">
        Welcome to <strong>Project FTK.</strong>
      </h2>
      <div>
      <h2 className="text-white">Lorem Ipsum is simply dummy text of the printing and.</h2>
      <h2 className="text-white">Lorem Ipsum is simply dummy text of the printing and.</h2>
      </div>
    </div>
    </>
  );
};

const v4 = () => {
  return (
    <>
    <div className="bg-black">
  <section className="w-screen h-screen flex items-center flex-col bg-[url('assets/images/hero_wide.png')] bg-cover bg-center">
    <div className=" w-screen h-screen grid grid-rows-6 grid-flow-col justify-center content-center text-white pt-20 bg-gradient-to-b from-black">
      <div className="row-span-3">
      <div className="bubble">Welcome to <strong>Project FTK.</strong> </div></div>
      <div className="row-span-1 text-center">
      <div className="text-lg">Enter your email to verify a teacher account.</div>
      <div className="w-96 flex outline outline-4 text-black">
        <input className="w-full focus:outline-none text-gray-400 px-4 py-3 bg-white" placeholder="Email address" type="text" />
        <div className="bg-red flex-shrink-0 flex ">
          <button className="px-4 flex  items-center border-l-4 border-black bubble--highlight text-black">New Teachers

            <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        </div>
      </div>
    </div>

  </section>

  <section className="   flex-col sm:flex-row h-full  flex  border-gray-700 border-t-8  min-half-screen  w-full z-50 text-white   bg-black">

<div className="flex my-auto  h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
  <div className="relative ">
    <img src="https://www.imageworks.com/sites/default/files/inline-images/spi_intospiderverse_website_content_003.jpg" />
  </div>

</div>

<div className="flex my-auto  h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
  <div className="text-left  w-full bubble bubble-align-start w-fit">Teachers.

  </div>
  <div className="text-xl bubble bubble-align-start w-fit">Get analytics on the class status, as well as individual students.
    .</div>
</div>

</section>

<section className="   flex-col sm:flex-row h-full  flex  border-gray-700 border-t-8  min-half-screen  w-full z-50 text-white   bg-black">
<div className="flex my-auto  h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
  <div className="text-left  w-full bubble bubble-align-start w-fit">Students.

  </div>
  <div className="text-xl bubble bubble-align-start w-fit">Get personalized problems and see where your pace is in the course and compared to the rest of the class.
    .</div>
</div>

<div className="flex my-auto  h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
  <div className="relative ">
    <img src="https://www.imageworks.com/sites/default/files/inline-images/spi_intospiderverse_website_content_003.jpg" />
  </div>

</div>

</section>
</div>
    </>
  );
};

export default v4;