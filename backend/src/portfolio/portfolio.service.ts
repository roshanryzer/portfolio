import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateProfileDto,
  UpdateProfileDto,
  CreateSkillDto,
  UpdateSkillDto,
  CreateCertificationDto,
  UpdateCertificationDto,
  CreateEducationDto,
  UpdateEducationDto,
  CreateExperienceDto,
  UpdateExperienceDto,
  CreateProjectDto,
  UpdateProjectDto,
} from './dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getProfile() {
    const profile = await this.prisma.profile.findFirst({
      orderBy: { createdAt: 'asc' },
    });
    return profile;
  }

  async getSkills() {
    return this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getCertifications() {
    return this.prisma.certification.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getEducation() {
    return this.prisma.education.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getExperience() {
    return this.prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getProjects() {
    return this.prisma.project.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getAll() {
    const [profile, skills, certifications, education, experience, projects] =
      await Promise.all([
        this.getProfile(),
        this.getSkills(),
        this.getCertifications(),
        this.getEducation(),
        this.getExperience(),
        this.getProjects(),
      ]);
    return {
      profile,
      skills,
      certifications,
      education,
      experience,
      projects,
    };
  }

  // ---- Profile ----
  async createProfile(dto: CreateProfileDto) {
    const existing = await this.prisma.profile.findFirst();
    if (existing) throw new Error('Profile already exists; use PATCH to update.');
    return this.prisma.profile.create({ data: dto });
  }

  async updateProfile(dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Profile not found');
    return this.prisma.profile.update({ where: { id: profile.id }, data: dto });
  }

  // ---- Skills ----
  async createSkill(dto: CreateSkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  async updateSkill(id: string, dto: UpdateSkillDto) {
    await this.prisma.skill.findUniqueOrThrow({ where: { id } });
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  async deleteSkill(id: string) {
    await this.prisma.skill.findUniqueOrThrow({ where: { id } });
    return this.prisma.skill.delete({ where: { id } });
  }

  // ---- Certifications ----
  async createCertification(dto: CreateCertificationDto) {
    return this.prisma.certification.create({
      data: { ...dto, issuedAt: new Date(dto.issuedAt) },
    });
  }

  async updateCertification(id: string, dto: UpdateCertificationDto) {
    await this.prisma.certification.findUniqueOrThrow({ where: { id } });
    const data = dto.issuedAt ? { ...dto, issuedAt: new Date(dto.issuedAt) } : dto;
    return this.prisma.certification.update({ where: { id }, data });
  }

  async deleteCertification(id: string) {
    await this.prisma.certification.findUniqueOrThrow({ where: { id } });
    return this.prisma.certification.delete({ where: { id } });
  }

  // ---- Education ----
  async createEducation(dto: CreateEducationDto) {
    return this.prisma.education.create({ data: dto });
  }

  async updateEducation(id: string, dto: UpdateEducationDto) {
    await this.prisma.education.findUniqueOrThrow({ where: { id } });
    return this.prisma.education.update({ where: { id }, data: dto });
  }

  async deleteEducation(id: string) {
    await this.prisma.education.findUniqueOrThrow({ where: { id } });
    return this.prisma.education.delete({ where: { id } });
  }

  // ---- Experience ----
  async createExperience(dto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async updateExperience(id: string, dto: UpdateExperienceDto) {
    await this.prisma.experience.findUniqueOrThrow({ where: { id } });
    const data: Record<string, unknown> = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.experience.update({ where: { id }, data: data as any });
  }

  async deleteExperience(id: string) {
    await this.prisma.experience.findUniqueOrThrow({ where: { id } });
    return this.prisma.experience.delete({ where: { id } });
  }

  // ---- Projects ----
  async createProject(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: dto.tech ? { ...dto, tech: dto.tech } : dto,
    });
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    await this.prisma.project.findUniqueOrThrow({ where: { id } });
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async deleteProject(id: string) {
    await this.prisma.project.findUniqueOrThrow({ where: { id } });
    return this.prisma.project.delete({ where: { id } });
  }
}
