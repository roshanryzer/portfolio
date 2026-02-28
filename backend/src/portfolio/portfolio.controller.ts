import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
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

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolio: PortfolioService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all portfolio data' })
  getAll() {
    return this.portfolio.getAll();
  }

  @Public()
  @Get('profile')
  @ApiOperation({ summary: 'Get profile' })
  getProfile() {
    return this.portfolio.getProfile();
  }

  @Public()
  @Get('skills')
  @ApiOperation({ summary: 'Get skills' })
  getSkills() {
    return this.portfolio.getSkills();
  }

  @Public()
  @Get('certifications')
  @ApiOperation({ summary: 'Get certifications' })
  getCertifications() {
    return this.portfolio.getCertifications();
  }

  @Public()
  @Get('education')
  @ApiOperation({ summary: 'Get education' })
  getEducation() {
    return this.portfolio.getEducation();
  }

  @Public()
  @Get('experience')
  @ApiOperation({ summary: 'Get experience' })
  getExperience() {
    return this.portfolio.getExperience();
  }

  @Public()
  @Get('projects')
  @ApiOperation({ summary: 'Get projects' })
  getProjects() {
    return this.portfolio.getProjects();
  }

  // ---- Write endpoints (any authenticated user) ----
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('profile')
  @ApiOperation({ summary: 'Create profile' })
  createProfile(@Body() dto: CreateProfileDto) {
    return this.portfolio.createProfile(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile')
  @ApiOperation({ summary: 'Update profile' })
  updateProfile(@Body() dto: UpdateProfileDto) {
    return this.portfolio.updateProfile(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('skills')
  @ApiOperation({ summary: 'Add skill' })
  createSkill(@Body() dto: CreateSkillDto) {
    return this.portfolio.createSkill(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('skills/:id')
  @ApiOperation({ summary: 'Update skill' })
  updateSkill(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return this.portfolio.updateSkill(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('skills/:id')
  @ApiOperation({ summary: 'Delete skill' })
  deleteSkill(@Param('id') id: string) {
    return this.portfolio.deleteSkill(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('certifications')
  @ApiOperation({ summary: 'Add certification' })
  createCertification(@Body() dto: CreateCertificationDto) {
    return this.portfolio.createCertification(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('certifications/:id')
  @ApiOperation({ summary: 'Update certification' })
  updateCertification(@Param('id') id: string, @Body() dto: UpdateCertificationDto) {
    return this.portfolio.updateCertification(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('certifications/:id')
  @ApiOperation({ summary: 'Delete certification' })
  deleteCertification(@Param('id') id: string) {
    return this.portfolio.deleteCertification(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('education')
  @ApiOperation({ summary: 'Add education' })
  createEducation(@Body() dto: CreateEducationDto) {
    return this.portfolio.createEducation(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('education/:id')
  @ApiOperation({ summary: 'Update education' })
  updateEducation(@Param('id') id: string, @Body() dto: UpdateEducationDto) {
    return this.portfolio.updateEducation(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('education/:id')
  @ApiOperation({ summary: 'Delete education' })
  deleteEducation(@Param('id') id: string) {
    return this.portfolio.deleteEducation(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('experience')
  @ApiOperation({ summary: 'Add experience' })
  createExperience(@Body() dto: CreateExperienceDto) {
    return this.portfolio.createExperience(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('experience/:id')
  @ApiOperation({ summary: 'Update experience' })
  updateExperience(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
    return this.portfolio.updateExperience(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('experience/:id')
  @ApiOperation({ summary: 'Delete experience' })
  deleteExperience(@Param('id') id: string) {
    return this.portfolio.deleteExperience(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('projects')
  @ApiOperation({ summary: 'Add project' })
  createProject(@Body() dto: CreateProjectDto) {
    return this.portfolio.createProject(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('projects/:id')
  @ApiOperation({ summary: 'Update project' })
  updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.portfolio.updateProject(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('projects/:id')
  @ApiOperation({ summary: 'Delete project' })
  deleteProject(@Param('id') id: string) {
    return this.portfolio.deleteProject(id);
  }
}
