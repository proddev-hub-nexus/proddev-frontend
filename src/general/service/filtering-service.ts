import { Course } from "../types/course";

export class CourseSearchService {
  private courses: Course[];

  constructor(courses: Course[]) {
    this.courses = courses;
  }

  private escapeHTML(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private sanitizeQuery(query: string): string {
    query = query
      .replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "")
      .trim()
      .toLowerCase();
    return this.escapeHTML(query);
  }

  public getAllCourses(): Course[] {
    return this.courses;
  }

  public filterAvailableCourses(): Course[] {
    return this.courses?.length ? this.courses.filter((c) => c.available) : [];
  }

  public filterCourses(query: string, category: string = "all"): Course[] {
    if (!this.courses?.length) return [];

    const sanitizedQuery = this.sanitizeQuery(query);
    const sanitizedCategory = this.sanitizeQuery(category);

    let filtered = this.courses;

    // Filter by category
    if (sanitizedCategory !== "all") {
      filtered = filtered.filter(
        (c) => c.category?.toLowerCase() === sanitizedCategory
      );
    }

    // Filter by search term
    if (sanitizedQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(sanitizedQuery) ||
          c.description?.toLowerCase().includes(sanitizedQuery) ||
          c.tutor?.toLowerCase().includes(sanitizedQuery)
      );
    }

    return filtered;
  }

  public paginateCourses(
    courses: Course[],
    currentPage: number,
    itemsPerPage: number
  ): Course[] {
    const start = (currentPage - 1) * itemsPerPage;
    return courses.slice(start, start + itemsPerPage);
  }
}
