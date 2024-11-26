import { useEffect, useRef, useState } from "react";
import { Block } from "../models/block";
import { BlockService } from "../services/block-service";
import { BlockRowList } from "./blocks-row-list";
import InfiniteScroll from "react-infinite-scroller";
import { SOCKET_HOST } from "../constants";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  message: (message: string) => void; // Add more events as needed
}

interface ClientToServerEvents {
  // Add events that the client emits to the server here
}

interface Props {
  initialBlocks: Block[];
}

export const BlockRowsContainer = (props: Props) => {

  const [blocks, setBlocks] = useState<Block[]>(props.initialBlocks);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const [pollCancelled, setPollCancelled] = useState<boolean>(false)


  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);


  useEffect(() => {
    const socketConnection: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_HOST);
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketConnection.onAny((_, event) => {
      const { type, data } = event;

      switch (type) {
        case "new_block": {
          const block = new Block(data);

          setBlocks((prevBlocks) => {
            const latestCurrentBlock = prevBlocks[0];
            if (latestCurrentBlock && latestCurrentBlock.height + 1 === block.height) {
              setPollCancelled(true);
            }

            const exists = prevBlocks.some((b) => b.height === block.height);

            return exists ? prevBlocks : [...prevBlocks, block];
          });

          break;
        }
        default:
          break;
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Polling effect
  useEffect(() => {
    const poll = async () => {
      if (pollCancelled) {
        return;
      }
      console.log("poll");

      const service = new BlockService();
      try {
        const data = await service.list(1);
        setBlocks((prevBlocks) => {
          const newBlocks = data.results.filter(
            (block) => !prevBlocks.some((b) => b.height === block.height)
          );
          return [...prevBlocks, ...newBlocks];
        });
      } catch (error) {
        console.error("Error during polling:", error);
      }
    };

    const interval = setInterval(() => {
      poll();
    }, 5000);

    return () => clearInterval(interval);
  }, [pollCancelled]);

  // Fetch Page
  const fetchPage = async (p: number) => {
    const service = new BlockService();
    try {
      const data = await service.list(p);
      setBlocks((prevBlocks) => {
        const newBlocks = data.results.filter(
          (block) => !prevBlocks.some((b) => b.height === block.height)
        );
        return [...prevBlocks, ...newBlocks];
      });
      setCanLoadMore(data.numPages > data.page);
    } catch (e) {
      console.error("Error fetching page:", e);
      setCanLoadMore(false);
    }
  };

  return (
    <div className="">
      <InfiniteScroll
        pageStart={props.initialBlocks.length < 1 ? 0 : 1}
        loadMore={fetchPage}
        hasMore={canLoadMore}
        initialLoad={true}
        loader={
          <div
            className="d-flex justify-content-center align-items-center"
            key={0}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <BlockRowList blocks={blocks} />
      </InfiniteScroll>
    </div>
  );
};
