// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export async function POST(req: Request) {
//   console.log("hello sir",process.env.OPENAI_API_KEY)
//   try {
//     const { userId } = auth();
//     const body = await req.json();
//     const { messages } = body;

//     // Validate the input data
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     if (!configuration.apiKey) {
//       return new NextResponse("OpenAI API Key not configured.", { status: 500 });
//     }
//     if (!messages) {
//       return new NextResponse("Messages are required", { status: 400 });
//     }

//     // Make the API call
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages,
//     });

//     // Check the API response structure and handle accordingly
//     if (
//       response &&
//       response.data &&
//       response.data.choices &&
//       response.data.choices.length > 0 &&
//       response.data.choices[0].message
//     ) {
//       const responseData = response.data.choices[0].message;
//       const jsonResponse = JSON.stringify(responseData);

//       return new NextResponse(jsonResponse, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     } else {
//       return new NextResponse("Invalid API response", { status: 500 });
//     }
//   } catch (error) {
//     console.log("[CONVERSATION_ERROR]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }


import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai";
import { AxiosError } from "axios";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  console.log("hello sir", process.env.OPENAI_API_KEY);
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    // Validate the input data
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // Make the API call
    const request: CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages,
    };

    const response = await openai.createChatCompletion(request);

    // Check the API response structure and handle accordingly
    if (
      response &&
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message
    ) {
      const responseData = response.data.choices[0].message;
      const jsonResponse = JSON.stringify(responseData);

      return new NextResponse(jsonResponse, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse("Invalid API response", { status: 500 });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (isAxiosError(error) && error.response && error.response.status === 429) {
        return new NextResponse("API rate limit exceeded. Please try again later.", { status: 429 });
      } else {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
      }
    } else {
      // Handle other unknown error types if necessary
      return new NextResponse("Unknown Error", { status: 500 });
    }
  }
}

// Helper function to check if the error is an AxiosError
function isAxiosError(error: Error): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}
