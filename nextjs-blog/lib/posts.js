import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const postDirectory = path.join(process.cwd(), "posts");

export function getSortedPostData() {
  const fileNames = fs.readdirSync(postDirectory);
  const allPostData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(fileContents);
    return {
      id,
      date: matterResult.data.date,
      title: matterResult.data.title,
    };
  });

  return allPostData.sort((a,b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}


export function getAllPostIds() {
  const fileNames = fs.readdirSync(postDirectory);
  // 返回的格式必须严格 [...{params: {id: ..}}]
  return fileNames.map((fName) => {
    return {
      params: {
        id: fName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const matterResult =  matter(fileContents);

  const processedContent = await remark()
    .use(remarkHtml)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    date: matterResult.data.date,
    title: matterResult.data.title,
    contentHtml,
  };
}