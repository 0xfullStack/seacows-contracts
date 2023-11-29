import { task } from 'hardhat/config';
import { deploy } from './deploy';

task('deploy:seacows', 'Deploy Seacows Periphery Contracts')
  .addParam('env', 'The env of Seacows Protocol to deploy')
  .setAction(deploy);
