import { Project } from "./types.js";

/**
 * Format a project into a string representation
 * @param project Project to format
 * @returns Formatted project string
 */
export function formatProject(project: Project): string {
  return `Title: ${project.settings.title}\nContext7-compatible library ID: ${project.settings.project}\n`;
}

/**
 * Format a list of projects into a string representation
 * @param projects Projects to format
 * @returns Formatted projects string
 */
export function formatProjectsList(projects: Project[]): string {
  const formattedProjects = projects.map(formatProject);
  return (
    formattedProjects.length +
    " available documentation libraries:\n\n" +
    formattedProjects.join("\n")
  );
}

/**
 * Rerank projects based on a search term
 * @param projects Projects to rerank
 * @param searchTerm Search term to rerank by
 * @returns Reranked projects
 */
export function rerankProjects(projects: Project[], searchTerm: string): Project[] {
  if (!searchTerm) return projects;

  // Normalize the search term - remove special characters and convert to lowercase
  const normalizedSearchTerm = searchTerm.toLowerCase().replace(/[^\w\s]/g, "");

  return [...projects].sort((a, b) => {
    const aTitle = a.settings.title.toLowerCase();
    const aProject = a.settings.project.toLowerCase();
    const aProjectName = aProject.split("/").pop() || "";
    const aProjectPath = aProject.split("/").slice(0, -1).join("/");

    const bTitle = b.settings.title.toLowerCase();
    const bProject = b.settings.project.toLowerCase();
    const bProjectName = bProject.split("/").pop() || "";
    const bProjectPath = bProject.split("/").slice(0, -1).join("/");

    // Normalize project names for better matching - remove special characters
    const normalizedATitle = aTitle.replace(/[^\w\s]/g, "");
    const normalizedAProject = aProject.replace(/[^\w\s]/g, "");
    const normalizedAProjectName = aProjectName.replace(/[^\w\s]/g, "");

    const normalizedBTitle = bTitle.replace(/[^\w\s]/g, "");
    const normalizedBProject = bProject.replace(/[^\w\s]/g, "");
    const normalizedBProjectName = bProjectName.replace(/[^\w\s]/g, "");

    // Calculate match scores for better ranking
    const aScore = calculateMatchScore(normalizedSearchTerm, {
      original: {
        title: aTitle,
        project: aProject,
        projectName: aProjectName,
        projectPath: aProjectPath,
      },
      normalized: {
        title: normalizedATitle,
        project: normalizedAProject,
        projectName: normalizedAProjectName,
      },
    });

    const bScore = calculateMatchScore(normalizedSearchTerm, {
      original: {
        title: bTitle,
        project: bProject,
        projectName: bProjectName,
        projectPath: bProjectPath,
      },
      normalized: {
        title: normalizedBTitle,
        project: normalizedBProject,
        projectName: normalizedBProjectName,
      },
    });

    // Check for exact docsRepoUrl match (highest priority)
    let finalAScore = aScore;
    let finalBScore = bScore;
    if (a.settings.docsRepoUrl === searchTerm || a.settings.docsRepoUrl === `https://${searchTerm}`)
      finalAScore += 200;
    if (b.settings.docsRepoUrl === searchTerm || b.settings.docsRepoUrl === `https://${searchTerm}`)
      finalBScore += 200;

    // Higher score first
    if (finalAScore !== finalBScore) {
      return finalBScore - finalAScore;
    }

    // Default to alphabetical by project name
    return aProject.localeCompare(bProject);
  });
}

/**
 * Calculate a match score for ranking
 * Higher score means better match
 */
function calculateMatchScore(
  searchTerm: string,
  projectData: {
    original: { title: string; project: string; projectName: string; projectPath: string };
    normalized: { title: string; project: string; projectName: string };
  }
): number {
  const { original, normalized } = projectData;
  let score = 0;

  // Exact matches (highest priority)
  if (
    original.project === searchTerm ||
    original.title === searchTerm ||
    original.projectName === searchTerm
  ) {
    score += 100;
  }

  // Normalized exact matches
  if (
    normalized.project === searchTerm ||
    normalized.title === searchTerm ||
    normalized.projectName === searchTerm
  ) {
    score += 90;
  }

  // Starts with matches
  if (
    original.project.startsWith(searchTerm) ||
    original.title.startsWith(searchTerm) ||
    original.projectName.startsWith(searchTerm)
  ) {
    score += 80;
  }

  // Normalized starts with matches
  if (
    normalized.project.startsWith(searchTerm) ||
    normalized.title.startsWith(searchTerm) ||
    normalized.projectName.startsWith(searchTerm)
  ) {
    score += 70;
  }

  // Contains matches
  if (
    original.project.includes(searchTerm) ||
    original.title.includes(searchTerm) ||
    original.projectName.includes(searchTerm) ||
    original.projectPath.includes(searchTerm)
  ) {
    score += 60;
  }

  // Normalized contains matches
  if (
    normalized.project.includes(searchTerm) ||
    normalized.title.includes(searchTerm) ||
    normalized.projectName.includes(searchTerm)
  ) {
    score += 50;
  }

  return score;
}
