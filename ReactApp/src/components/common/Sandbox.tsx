
const Sandbox = (props : any) => {
    return (
        <>
          <div className="absolute w-screen h-12 bg"></div>
          <iframe className="center w-screen h-screen px-5 pb-5" id="ProblemFrame" src={"https://blockly-demo.appspot.com/static/demos/code/index.html"} title="Sandbox" ></iframe>
        </>
  );
};

export default Sandbox;