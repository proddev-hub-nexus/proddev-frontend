import Image from "next/image";

const ProfileAvatar = ({
  entityName,
  typeOfEntity,
  imageUrl,
}: {
  entityName: string | undefined;
  typeOfEntity: "instructor" | "student" | "expert";
  imageUrl?: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <picture>
        <Image
          width={33}
          height={32}
          src={`/${imageUrl}`}
          alt={`${typeOfEntity} Avatar`}
          className="w-[34px] h-[32px] rounded-full"
        />
      </picture>
      <div>
        <h6 className="text-[12px] font-semibold leading-[15px]">
          {typeOfEntity}:
        </h6>
        <h6
          style={{
            color: "rgba(227, 227, 227, 0.89)",
          }}
          className="text-[12px] font-medium leading-[19px] "
        >
          {entityName}
        </h6>
      </div>
    </div>
  );
};

export default ProfileAvatar;
