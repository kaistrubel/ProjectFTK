import IUserInfo from "../../types/User";

const NoClasses = (props : any) => {
    return (
      <div className="grid place-items-center pt-16">
        <div className="bubble bubble-header">
          You are currently not signed up for any classes. Please {props.isTeacher? "create" : "join"} a class to get started.
        </div>
      </div>
  );
};

export default NoClasses;