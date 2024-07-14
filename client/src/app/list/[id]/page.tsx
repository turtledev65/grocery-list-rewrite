"use client";

import { Item, ItemForm } from "./_components";
import { useGetList } from "./_hooks";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const { data: list, status, error } = useGetList(params.id);

  return (
    <>
      <h1 className="text-3xl font-bold">
        {status == "pending"
          ? "Loading..."
          : status == "error"
            ? "Error"
            : list.name}
      </h1>
      {status == "error" && <p>{error.message}</p>}
      <ul>
        {list?.items?.map(item => (
          <Item
            text={item.text}
            pending={item.pending}
            id={item.id}
            listId={params.id}
            images={item.images}
            key={item.id}
          />
        ))}
      </ul>
      <ItemForm listId={params.id} />
    </>
  );
};

export default ListPage;
