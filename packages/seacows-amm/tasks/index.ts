import { task } from 'hardhat/config';
import { deploy } from './deploy';
import { mint } from './mint';

task('deploy:seacows', 'Deploy Seacows Contracts')
  .addParam('env', 'The env of Seacows Protocol to deploy')
  .setAction(deploy);

task('mint', 'Mint from SeacowsPositionManager')
  .addParam('env', 'The env of Seacows Protocol to deploy')
  .setAction(mint);
