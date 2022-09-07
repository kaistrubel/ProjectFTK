import GoogleButton from 'react-google-button'
import { ChevronDoubleDownIcon } from '@heroicons/react/outline'

const Signup = () => {
  return (
    <>
    <div className="bg-black">
      <section className="w-screen h-screen flex items-center flex-col bg-[url('assets/images/mountain-x.jpg')] bg-cover bg-center">
        <div className=" w-screen h-screen grid grid-rows-6 grid-flow-col justify-center content-center text-white pt-20 bg-gradient-to-t from-black">
          <div className="row-span-2">
          <div className="bubble bubble-header">Welcome to <strong>Project FTK.</strong> </div>
          </div>
          <div  className='row-span-1 hidden'>
          <div className="text-3xl">Enter your email to start a teacher account</div>
            <div className='center'>
          <div className="w-96 flex outline outline-4 text-black">
            <input className="w-full focus:outline-none text-gray-400 px-4 py-3 bg-white focus:text-black" placeholder="Email address" type="text" />
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
          <div className="row-span-2 pt-16 text-center">
          <div className="text-2xl text-center pb-3">Ready to get started?</div>
            <div className='center'>
              <GoogleButton style={{backgroundColor: `black`, width:360, fontSize: 23, fontFamily: "Dekko"}} className='outline outline-2' onClick={() => {window.location.href = '/Auth/GoogleLogin' }}/>
            </div>
          </div>
          <div className="absolute bottom-0 center w-full flex">
          <ChevronDoubleDownIcon className="h-5 w-5 inline-block" aria-hidden="true"/>
          <div className="text-2xl p-5">New Teachers</div>
          <ChevronDoubleDownIcon className="h-5 w-5 flex" aria-hidden="true"/>
          </div>
        </div>
      </section>

      <section className="border-gray-700 border-t-8 w-full z-50 text-white center flex-col  p-6 bg-black">
          <div className="text-xl w-fit text-4xl tex-center"><strong>Sign up as a teacher</strong></div>
          <div className="text-xl w-fit pt-10"> Please email <strong className='text-green-500'>projectftk2022@gmail.com</strong> with your email to get verified as a teacher</div>
      </section>

      <section className="   flex-col sm:flex-row h-full  flex  border-gray-700 border-t-8  min-half-screen  w-full z-50 text-white   bg-black">
        <div className="flex my-auto h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
          <div className="text-xl w-fit text-4xl"><strong>The FTK platform provides a place for teachers to share educational content, indexed to structured curriculums</strong></div>
          <div className="text-xl w-fit pt-10"> FTK enables teachers to match labs, problems and lectures to concepts and the content is then ranked based on student success. As students progress through lessons, they will always be prompted with the best problem lecture combo available.</div>
        </div>
        <div className="flex my-auto  h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
        <div className="flex-1 w-full bg-[url('assets/images/lesson.png')] comic-border bg-center bg-contain">
            <div className="grid grid-rows-[100px_minmax(200px,_1fr)_100px] place-items-center">
            </div>
          </div>
        </div>
      </section>

      <section className="   flex-col sm:flex-row h-full  flex  border-gray-700 border-t-8  min-half-screen  w-full z-50 text-white   bg-black">
        <div className="flex my-auto  h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
          <div className="flex-1 w-full bg-[url('assets/images/dashboard.png')] comic-border bg-center bg-contain">
            <div className="grid grid-rows-[100px_minmax(200px,_1fr)_100px] place-items-center">
            </div>
          </div>
        </div>
        <div className="flex my-auto h-full justify-center   items- center  flex-col sm:w-1/2 w-full p-12">
        <div className="text-xl w-fit text-4xl"> <strong>The FTK platform presents data insights to provide teachers real time feedback on the classroom’s progression</strong></div>
          <div className="text-xl w-fit pt-10"> With our analysis, a teacher walks into the classroom armed with actionable insights. For example, the dashboard may advise a teacher to cover a specific example problem that the majority of the class struggled on, or provide a list of students at risk of falling behind or becoming disengaged.</div>
        </div>
      </section>

      <section className="   flex-col sm:flex-row h-full  flex  border-gray-700 border-t-8  min-half-screen  w-full z-50 text-white   bg-black">
        <div className="flex my-auto h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
          <div className="text-xl w-fit text-4xl"><strong>The FTK platform enables real time project collaboration between teachers and students</strong></div>
          <div className="text-xl w-fit pt-10">Project lab manuals are stored in the cloud and receive live updates. Students can submit samples for quick feedback from the teacher.</div>
        </div>
        <div className="flex my-auto  h-full justify-center   items-center  flex-col sm:w-1/2 w-full p-12">
        <div className="flex-1 w-full bg-[url('assets/images/lab.png')] comic-border bg-center bg-contain">
            <div className="grid grid-rows-[100px_minmax(200px,_1fr)_100px] place-items-center">
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Signup;