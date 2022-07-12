import ReactLoading from 'react-loading';

const Loading = () => {
    return (
        <div className="loading">
            <ReactLoading
            type={"bars"}
            color={"#ffcd28"}
            height={100}
            width={100}
            />
        </div>
  );
};

export default Loading;