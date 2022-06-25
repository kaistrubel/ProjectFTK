import Image from 'next/image';

const SignUp = () => (
    <div className="container py-16 flex items-start justify-between flex-col lg:flex-row" id="contact">
      <div className="flex-1 w-full md:w-1/2">
        <Image
        src={require("/assets/images/dev.svg")}
        alt="Student Image"
        width={463}
        height={273}
        layout="responsive"
        objectFit="contain"
        priority
        />
      </div>
    </div>
);

export default SignUp;