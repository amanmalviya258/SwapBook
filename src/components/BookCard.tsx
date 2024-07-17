import { useNavigate } from "react-router-dom";

type BookCardProps = {
  id: string;
  name: string;
  ISBN: string;
};

const BookCard = ({ name, ISBN, id }: BookCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="max-w-[200px] p-2 border rounded cursor-pointer"
      onClick={() => navigate(`/${id}`)}
    >
      <img
        src={`https://covers.openlibrary.org/b/isbn/${ISBN}-L.jpg`}
        className="w-full"
      />
      <div className="text-lg font-bold">{name}</div>
    </div>
  );
};

export default BookCard;
